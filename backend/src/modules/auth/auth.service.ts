import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto';
import { PasswordService } from '@modules/password/password.service';
import { StaffRepository } from '@modules/staff/repository/staff.repository';
import { CustomerService } from '@modules/customer/customer.service';
import { normalizeEmail } from '@common/utils';
import { JwtService } from '@nestjs/jwt';
import {
  AuthRepository,
  type SessionToken,
} from './repository/auth.repository';
import { IAuthUser, IJwtPayload, ITokens } from './interfaces';
import { AuthAudience } from '@common/constants';

const INVALID_CREDENTIALS_MESSAGE = 'Email or password are invalid';

/**
 * Sessions of both apps. Customers and staff are separate accounts in separate tables: a
 * storefront sign-in never finds a staff member and a CMS sign-in never finds a customer.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly staffRepository: StaffRepository,
  ) {}

  private signAccessToken(
    {
      userId,
      familyId,
      aal,
    }: Pick<SessionToken, 'userId' | 'familyId' | 'aal'>,
    audience: AuthAudience,
  ): string {
    const payload: IJwtPayload = {
      id: userId,
      sid: familyId,
      aud: audience,
      aal,
    };
    return this.jwtService.sign(payload);
  }

  private async generateTokens(
    userId: string,
    userAgent: string | undefined,
    audience: AuthAudience,
  ): Promise<ITokens> {
    const refreshToken = await this.authRepository.setRefreshToken(
      userId,
      userAgent,
      audience,
    );

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.signAccessToken(refreshToken, audience),
      refreshToken,
    };
  }

  //COMMENT the hash is always compared (a dummy one for unknown emails), so timing reveals nothing
  private async checkPassword<T extends { password: string | null }>(
    account: T | null,
    password: string,
  ): Promise<T> {
    const isPasswordValid = await this.passwordService.isPasswordValid(
      password,
      account?.password,
    );
    if (!account || !isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    return account;
  }

  //COMMENT a storefront session for a customer found another way (Google), no password involved
  signInVerifiedCustomer(customerId: string, userAgent?: string) {
    return this.generateTokens(customerId, userAgent, AuthAudience.STOREFRONT);
  }

  //COMMENT storefront: customers only
  async signIn({ email, password }: SignInDto, userAgent?: string) {
    const customer = await this.checkPassword(
      await this.customerService.findByEmail(email),
      password,
    );
    return this.generateTokens(customer.id, userAgent, AuthAudience.STOREFRONT);
  }

  //COMMENT the same answer as for wrong credentials, so it does not reveal who is staff
  async signInCms({ email, password }: SignInDto, userAgent?: string) {
    const staff = await this.checkPassword(
      await this.staffRepository.findStaffUserByEmail(normalizeEmail(email)),
      password,
    );

    if (!staff.emailVerifiedAt || staff.revokedAt) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.generateTokens(staff.id, userAgent, AuthAudience.CMS);
  }

  //COMMENT the key has signed: the session moves to aal 2 and gets a matching access token
  async elevateSession(user: IAuthUser, credentialId: string): Promise<string> {
    await this.authRepository.elevateSession(user.sid, credentialId);

    return this.signAccessToken(
      { userId: user.id, familyId: user.sid, aal: 2 },
      AuthAudience.CMS,
    );
  }

  async refreshToken(
    refreshToken: string,
    userAgent: string | undefined,
    audience: AuthAudience,
  ): Promise<ITokens> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    //COMMENT null: the token is unknown, expired, reused or from the other app's table
    const token = await this.authRepository.rotateRefreshToken(
      refreshToken,
      userAgent,
      audience,
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.signAccessToken(token, audience),
      refreshToken: token,
    };
  }

  findSessionUser(sessionId: string, userId: string, audience: AuthAudience) {
    return this.authRepository.findSessionUser(sessionId, userId, audience);
  }

  findToken(refreshToken: string, audience: AuthAudience) {
    return this.authRepository.findRefreshToken(refreshToken, audience);
  }

  findSessionByUserIdAndUserAgent(userId: string, userAgent: string) {
    return this.authRepository.findSessionByUserIdAndUserAgent(
      userId,
      userAgent,
    );
  }

  deleteToken(refreshToken: string, audience: AuthAudience) {
    return this.authRepository.deleteRefreshToken(refreshToken, audience);
  }

  deleteSession(
    sessionId: string,
    audience: AuthAudience = AuthAudience.STOREFRONT,
  ) {
    return this.authRepository.deleteRefreshTokenFamily(sessionId, audience);
  }

  deleteAllTokens(userId: string, audience: AuthAudience) {
    return this.authRepository.deleteAllRefreshTokens(userId, audience);
  }
}
