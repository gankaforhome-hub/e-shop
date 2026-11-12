import {
  WEBAUTHN_ORIGINS,
  WEBAUTHN_RP_ID,
  WEBAUTHN_RP_NAME,
} from '@common/constants';
import { parseEnvList } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { E_StaffRole, E_WebAuthnChallengePurpose } from '@prisma/client';
import {
  AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { StaffRepository } from './repository/staff.repository';
import { StaffAccessService } from './staff-access.service';
import { FreshAction } from './staff.constants';

const getActionKey = (action: FreshAction, targetId?: string) =>
  `${action}:${targetId ?? ''}`;

@Injectable()
export class WebAuthnService {
  constructor(
    private readonly configService: ConfigService,
    private readonly staffRepository: StaffRepository,
    private readonly staffAccess: StaffAccessService,
  ) {}

  private get rpId(): string {
    return this.configService.get<string>(WEBAUTHN_RP_ID, 'localhost');
  }

  private get rpName(): string {
    return this.configService.get<string>(WEBAUTHN_RP_NAME, 'Ganka CMS');
  }

  private get origins(): string[] {
    return parseEnvList(
      this.configService.get<string>(WEBAUTHN_ORIGINS, 'http://localhost:3030'),
    );
  }

  private isRootRole({ staff }: IAuthUser): boolean {
    return staff?.role === E_StaffRole.ROOT;
  }

  /**
   * A new key needs a code handed over outside of email, or an existing key. One exception:
   * a staff member (not root) with no key at all adds the first one from the password session.
   * Such an account is not approved yet (an invite or a key reset clears the approval), so
   * the key gives no access until an ADMIN or root approves it in the team list.
   * Returns whether the fresh assertion of an existing key is needed.
   */
  private async assertCanRegister(
    user: IAuthUser,
    enrollmentCode?: string,
  ): Promise<{ needsFreshAssertion: boolean }> {
    if (!user.staff || user.staff.revokedAt) {
      throw new ForbiddenException();
    }
    if (enrollmentCode) {
      const code = await this.staffRepository.findEnrollmentCode(
        enrollmentCode,
        user.id,
      );
      if (!code) {
        throw new ForbiddenException('Invalid or expired enrollment code');
      }
      return { needsFreshAssertion: false };
    }
    if (
      !this.isRootRole(user) &&
      (await this.staffRepository.countCredentials(user.id)) === 0
    ) {
      return { needsFreshAssertion: false };
    }
    if (user.aal < 2) {
      throw new ForbiddenException();
    }
    return { needsFreshAssertion: true };
  }

  countKeys(userId: string): Promise<number> {
    return this.staffRepository.countCredentials(userId);
  }

  async createRegistrationOptions(
    user: IAuthUser,
    enrollmentCode?: string,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    await this.assertCanRegister(user, enrollmentCode);

    const credentials = await this.staffRepository.findCredentials(user.id);
    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpId,
      userName: user.email,
      userID: Buffer.from(user.id),
      attestationType: 'none',
      excludeCredentials: credentials.map(({ id, transports }) => ({
        id,
        transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
        //COMMENT a root key must be a separate device, see verifyRegistration
        ...(this.isRootRole(user)
          ? { authenticatorAttachment: 'cross-platform' as const }
          : {}),
      },
    });

    await this.staffRepository.saveChallenge(
      user.id,
      E_WebAuthnChallengePurpose.REGISTRATION,
      options.challenge,
    );
    return options;
  }

  //COMMENT returns the credential id: a root admin has to add it to ROOT_CREDENTIAL_IDS
  async verifyRegistration(
    user: IAuthUser,
    response: RegistrationResponseJSON,
    enrollmentCode: string | undefined,
    freshAssertion: string | undefined,
    ip?: string,
  ): Promise<string> {
    const { needsFreshAssertion } = await this.assertCanRegister(
      user,
      enrollmentCode,
    );
    if (needsFreshAssertion) {
      await this.assertFresh(
        user,
        'webauthn.add_key',
        user.id,
        freshAssertion,
        ip,
      );
    }

    const expectedChallenge = await this.staffRepository.consumeChallenge(
      user.id,
      E_WebAuthnChallengePurpose.REGISTRATION,
    );
    if (!expectedChallenge) {
      throw new BadRequestException('Invalid or expired challenge');
    }

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.origins,
      expectedRPID: this.rpId,
      requireUserVerification: true,
    }).catch(() => {
      throw new BadRequestException('The key could not be verified');
    });
    if (!verified) {
      throw new BadRequestException('The key could not be verified');
    }

    const { credential, credentialDeviceType, credentialBackedUp } =
      registrationInfo;

    //COMMENT a synced passkey lives in a cloud account, which a mailbox can often recover
    if (
      this.isRootRole(user) &&
      (credentialDeviceType !== 'singleDevice' || credentialBackedUp)
    ) {
      throw new BadRequestException(
        'A root admin needs a hardware key, synced passkeys are not accepted',
      );
    }

    const isAdded = await this.staffRepository.addCredential(
      {
        id: credential.id,
        userId: user.id,
        publicKey: new Uint8Array(credential.publicKey),
        counter: credential.counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: credential.transports ?? [],
      },
      {
        actorId: user.id,
        action: 'webauthn.register',
        targetId: user.id,
        ip,
        meta: { credentialId: credential.id },
      },
      enrollmentCode,
    );
    if (!isAdded) {
      throw new BadRequestException('The key could not be registered');
    }
    return credential.id;
  }

  private async createAssertionChallenge(
    user: IAuthUser,
    purpose: E_WebAuthnChallengePurpose,
    action?: string,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const credentials = await this.staffRepository.findCredentials(user.id);
    if (credentials.length === 0) {
      throw new BadRequestException('No hardware key is registered');
    }

    const options = await generateAuthenticationOptions({
      rpID: this.rpId,
      userVerification: 'required',
      allowCredentials: credentials.map(({ id, transports }) => ({
        id,
        transports,
      })),
    });

    await this.staffRepository.saveChallenge(
      user.id,
      purpose,
      options.challenge,
      action,
    );
    return options;
  }

  //COMMENT returns the id of the key that signed, or null if the signature does not hold
  private async verifyAssertion(
    user: IAuthUser,
    response: AuthenticationResponseJSON,
    purpose: E_WebAuthnChallengePurpose,
    action?: string,
  ): Promise<string | null> {
    const expectedChallenge = await this.staffRepository.consumeChallenge(
      user.id,
      purpose,
      action,
    );
    const credential =
      typeof response?.id === 'string'
        ? await this.staffRepository.findCredential(response.id, user.id)
        : null;

    if (!expectedChallenge || !credential) {
      return null;
    }

    const result = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.origins,
      expectedRPID: this.rpId,
      requireUserVerification: true,
      credential: {
        id: credential.id,
        publicKey: new Uint8Array(credential.publicKey),
        counter: Number(credential.counter),
        transports: credential.transports,
      },
    }).catch(() => null);

    if (!result?.verified) {
      return null;
    }

    await this.staffRepository.updateCredentialCounter(
      credential.id,
      result.authenticationInfo.newCounter,
    );
    return credential.id;
  }

  createLoginOptions(
    user: IAuthUser,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return this.createAssertionChallenge(
      user,
      E_WebAuthnChallengePurpose.LOGIN,
    );
  }

  async verifyLogin(
    user: IAuthUser,
    response: AuthenticationResponseJSON,
    ip?: string,
  ): Promise<string> {
    const credentialId = await this.verifyAssertion(
      user,
      response,
      E_WebAuthnChallengePurpose.LOGIN,
    );

    await this.staffRepository.recordAudit({
      actorId: user.id,
      action: credentialId ? 'webauthn.login' : 'webauthn.login_failed',
      targetId: user.id,
      ip,
      meta: credentialId ? { credentialId } : undefined,
    });

    if (!credentialId) {
      throw new UnauthorizedException();
    }
    return credentialId;
  }

  async createAssertionOptions(
    user: IAuthUser,
    action: FreshAction,
    targetId?: string,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    if (user.aal < 2) {
      throw new ForbiddenException();
    }
    return this.createAssertionChallenge(
      user,
      E_WebAuthnChallengePurpose.ASSERTION,
      getActionKey(action, targetId),
    );
  }

  //COMMENT the proof is a signature over a challenge issued for this action on this target
  async assertFresh(
    user: IAuthUser,
    action: FreshAction,
    targetId: string,
    encodedAssertion: string | undefined,
    ip?: string,
  ): Promise<void> {
    const response = this.decodeAssertion(encodedAssertion);
    const credentialId =
      response &&
      (await this.verifyAssertion(
        user,
        response,
        E_WebAuthnChallengePurpose.ASSERTION,
        getActionKey(action, targetId),
      ));

    //COMMENT a key added to the database behind our back is not on the root list
    const isAccepted =
      !!credentialId &&
      (!this.isRootRole(user) ||
        this.staffAccess.isRootCredential(credentialId));

    if (!isAccepted) {
      await this.staffRepository.recordAudit({
        actorId: user.id,
        action: 'webauthn.assertion_failed',
        targetId,
        ip,
        meta: { action },
      });
      throw new ForbiddenException(
        'A fresh hardware key signature is required',
      );
    }
  }

  private decodeAssertion(
    encoded: string | undefined,
  ): AuthenticationResponseJSON | null {
    if (!encoded) {
      return null;
    }
    try {
      return JSON.parse(
        Buffer.from(encoded, 'base64url').toString(),
      ) as AuthenticationResponseJSON;
    } catch {
      return null;
    }
  }
}
