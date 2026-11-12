import { normalizeEmail } from '@common/utils';
import { CustomerService } from '@modules/customer/customer.service';
import { MailService } from '@modules/mail/mail.service';
import { PasswordService } from '@modules/password/password.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Customer,
  E_ConsentSource,
  E_CustomerTokenPurpose,
} from '@prisma/client';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmEmailChangeDto,
  EmailDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto';
import { IAuthUser } from './interfaces';
import { AuthRepository } from './repository/auth.repository';
import { TurnstileService } from './turnstile.service';

const MINUTE_MS = 60 * 1000;
const EMAIL_VERIFICATION_LIFETIME_MS = 24 * 60 * MINUTE_MS;
const PASSWORD_RESET_LIFETIME_MS = 30 * MINUTE_MS;
const EMAIL_CHANGE_LIFETIME_MS = 60 * MINUTE_MS;

const INVALID_TOKEN_MESSAGE = 'Invalid or expired token';

export type RequestContext = { ip?: string; userAgent?: string };

/** Storefront customer accounts. Staff accounts have their own flows (`StaffAccountService`). */
@Injectable()
export class AccountService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly passwordService: PasswordService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly turnstile: TurnstileService,
  ) {}

  private async sendEmailVerification({ id, email }: Customer): Promise<void> {
    const token = await this.authRepository.createOneTimeToken(
      id,
      E_CustomerTokenPurpose.EMAIL_VERIFICATION,
      EMAIL_VERIFICATION_LIFETIME_MS,
    );
    this.mailService.sendEmailVerification(email, token);
  }

  /**
   * The caller gets the same answer either way, so sign-up reveals neither existing emails nor
   * taken phones. A new account works at once; the welcome mail only asks to confirm the email.
   * The DTO only passes with acceptTerms === true; the consent journal records it with the
   * version, the request's ip and user agent.
   */
  async signUp(
    {
      firstName,
      lastName,
      email,
      password,
      phone,
      marketingConsent,
      turnstileToken,
    }: SignUpDto,
    { ip, userAgent }: RequestContext,
  ): Promise<void> {
    await this.turnstile.assertHuman(turnstileToken, ip);

    const existing = await this.customerService.findByEmail(email);
    const isPhoneTaken =
      !!phone && (await this.customerService.isPhoneTaken(phone));

    const passwordHash = await this.passwordService.getHashPassword(password);
    //COMMENT the hash above is computed either way, so the timing does not reveal it
    if (existing || isPhoneTaken) {
      if (existing) {
        this.mailService.sendAccountExists(existing.email);
      }
      return;
    }

    const customer = await this.customerService.create(
      {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        marketingEmail: marketingConsent === true,
      },
      { source: E_ConsentSource.SIGN_UP, ip, userAgent },
    );
    if (customer) {
      await this.sendEmailVerification(customer);
    }
  }

  //COMMENT only to the signed-in customer's own address, so nobody can mail links to strangers
  async resendVerification(actor: IAuthUser): Promise<void> {
    const customer = await this.customerService.findById(actor.id);
    if (customer && !customer.emailVerifiedAt) {
      await this.sendEmailVerification(customer);
    }
  }

  /**
   * Needs the session of the very account the link was sent for. Someone may sign up with a
   * stranger's address; the stranger gets the link, but a click without that account's session
   * confirms nothing. The real owner takes the address back with a password reset, which proves
   * the mailbox, marks it verified and ends every session.
   */
  async verifyEmail(
    actor: IAuthUser,
    { token }: VerifyEmailDto,
  ): Promise<void> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_CustomerTokenPurpose.EMAIL_VERIFICATION,
    );

    if (!oneTimeToken || oneTimeToken.userId !== actor.id) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted =
      await this.authRepository.completeEmailVerification(oneTimeToken);
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
  }

  async forgotPassword(
    { email, turnstileToken }: EmailDto,
    ip?: string,
  ): Promise<void> {
    await this.turnstile.assertHuman(turnstileToken, ip);

    const customer = await this.customerService.findByEmail(email);
    if (!customer) {
      return;
    }

    const token = await this.authRepository.createOneTimeToken(
      customer.id,
      E_CustomerTokenPurpose.PASSWORD_RESET,
      PASSWORD_RESET_LIFETIME_MS,
    );
    this.mailService.sendPasswordReset(customer.email, token, 'storefront');
  }

  async resetPassword({ token, password }: ResetPasswordDto): Promise<void> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_CustomerTokenPurpose.PASSWORD_RESET,
    );
    const customer =
      oneTimeToken &&
      (await this.customerService.findById(oneTimeToken.userId));

    if (!oneTimeToken || !customer) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted = await this.authRepository.completePasswordReset(
      oneTimeToken,
      await this.passwordService.getHashPassword(password),
    );
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    this.mailService.sendPasswordChanged(customer.email);
  }

  async changePassword(
    actor: IAuthUser,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    await this.assertPassword(actor.id, currentPassword);

    await this.authRepository.changePassword(
      actor.id,
      await this.passwordService.getHashPassword(newPassword),
      actor.sid,
    );
    this.mailService.sendPasswordChanged(actor.email);
  }

  /**
   * Both addresses get a token. When the new one is taken, its owner gets a notice instead,
   * and the old address still gets its token, so the requester can't tell the difference.
   */
  async changeEmail(
    actor: IAuthUser,
    { newEmail, password }: ChangeEmailDto,
  ): Promise<void> {
    await this.assertPassword(actor.id, password);

    const email = normalizeEmail(newEmail);
    if (email === actor.email) {
      throw new BadRequestException('This is already your email');
    }

    await this.authRepository.deleteEmailChangeTokens(actor.id);

    const oldAddressToken = await this.authRepository.createOneTimeToken(
      actor.id,
      E_CustomerTokenPurpose.EMAIL_CHANGE_OLD,
      EMAIL_CHANGE_LIFETIME_MS,
      email,
    );
    this.mailService.sendEmailChangeConfirmation(actor.email, oldAddressToken);

    if (await this.customerService.findByEmail(email)) {
      this.mailService.sendEmailChangeRefused(email);
      return;
    }

    const newAddressToken = await this.authRepository.createOneTimeToken(
      actor.id,
      E_CustomerTokenPurpose.EMAIL_CHANGE_NEW,
      EMAIL_CHANGE_LIFETIME_MS,
      email,
    );
    this.mailService.sendEmailChangeConfirmation(email, newAddressToken);
  }

  //COMMENT true when the email was changed, false while the other address has not confirmed
  async confirmEmailChange({ token }: ConfirmEmailChangeDto): Promise<boolean> {
    const oneTimeToken =
      (await this.authRepository.findOneTimeToken(
        token,
        E_CustomerTokenPurpose.EMAIL_CHANGE_OLD,
      )) ??
      (await this.authRepository.findOneTimeToken(
        token,
        E_CustomerTokenPurpose.EMAIL_CHANGE_NEW,
      ));
    const customer =
      oneTimeToken &&
      (await this.customerService.findById(oneTimeToken.userId));

    if (!oneTimeToken?.newEmail || !customer) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const result = await this.authRepository.confirmEmailChange(oneTimeToken);

    switch (result) {
      case 'pending':
        return false;
      case 'applied':
        this.mailService.sendEmailChanged(
          customer.email,
          oneTimeToken.newEmail,
        );
        return true;
      case 'conflict':
        throw new ConflictException('Unable to change the email');
      case 'invalid':
        throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
  }

  private async assertPassword(customerId: string, password: string) {
    const customer = await this.customerService.findById(customerId);
    const isPasswordValid = await this.passwordService.isPasswordValid(
      password,
      customer?.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }
  }
}
