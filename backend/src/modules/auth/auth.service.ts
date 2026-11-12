import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto';
import { PasswordService } from '@modules/password/password.service';
import { StaffRepository } from '@modules/staff/repository/staff.repository';
import { UserService } from '@modules/user/user.service';
import { E_AuthAudience, Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { IAuthUser, IJwtPayload, ITokens } from './interfaces';

const INVALID_CREDENTIALS_MESSAGE = 'Email or password are invalid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly staffRepository: StaffRepository,
  ) {}

  private signAccessToken({
    userId,
    familyId,
    audience,
    aal,
  }: Pick<Token, 'userId' | 'familyId' | 'audience' | 'aal'>): string {
    const payload: IJwtPayload = {
      id: userId,
      sid: familyId,
      aud: audience,
      aal,
    };
    return this.jwtService.sign(payload);
  }

  private async generateTokens(
    user: User,
    userAgent: string | undefined,
    audience: E_AuthAudience,
  ): Promise<ITokens> {
    const refreshToken = await this.authRepository.setRefreshToken(
      user.id,
      userAgent,
      audience,
    );

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return { accessToken: this.signAccessToken(refreshToken), refreshToken };
  }

  private async validateCredentials({
    email,
    password,
  }: SignInDto): Promise<User> {
    const user: User | null = await this.userService.findOneByEmail(email);

    const isPasswordValid = await this.passwordService.isPasswordValid(
      password,
      user?.password,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    return user;
  }

  //COMMENT a storefront session for a user found another way (Google), no password involved
  signInVerifiedUser(user: User, userAgent?: string): Promise<ITokens> {
    return this.generateTokens(user, userAgent, E_AuthAudience.STOREFRONT);
  }

  //COMMENT sign in by email, password
  async signIn(signInDto: SignInDto, userAgent?: string): Promise<ITokens> {
    const user = await this.validateCredentials(signInDto);
    const tokens: ITokens = await this.generateTokens(
      user,
      userAgent,
      E_AuthAudience.STOREFRONT,
    );

    return tokens;
  }

  //COMMENT the same answer as for wrong credentials, so it does not reveal who is staff.
  //A pending member may sign in: registering the first key needs a session
  async signInCms(signInDto: SignInDto, userAgent?: string): Promise<ITokens> {
    const user = await this.validateCredentials(signInDto);
    const staff = await this.staffRepository.findStaffAccount(user.id);

    if (!user.emailVerifiedAt || !staff || staff.revokedAt) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.generateTokens(user, userAgent, E_AuthAudience.CMS);
  }

  //COMMENT the key has signed: the session moves to aal 2 and gets a matching access token
  async elevateSession(user: IAuthUser, credentialId: string): Promise<string> {
    await this.authRepository.elevateSession(user.sid, credentialId);

    return this.signAccessToken({
      userId: user.id,
      familyId: user.sid,
      audience: user.aud,
      aal: 2,
    });
  }

  //COMMENT sign in by email, password
  async signOut(refreshToken: string): Promise<Token | null> {
    return await this.authRepository.deleteRefreshToken(refreshToken);
  }

  //COMMENT get refresh token
  async refreshToken(
    refreshToken: string,
    userAgent?: string,
    audience: E_AuthAudience = E_AuthAudience.STOREFRONT,
  ): Promise<ITokens> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    //COMMENT null: the token is unknown, expired, reused or from the other app
    const token = await this.authRepository.rotateRefreshToken(
      refreshToken,
      userAgent,
      audience,
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    return { accessToken: this.signAccessToken(token), refreshToken: token };
  }

  findSessionUser(sessionId: string, userId: string) {
    return this.authRepository.findSessionUser(sessionId, userId);
  }

  async findToken(refreshToken: string): Promise<Token | null> {
    return await this.authRepository.findRefreshToken(refreshToken);
  }

  async findSessionByUserIdAndUserAgent(
    userId: string,
    userAgent: string,
  ): Promise<Token | null> {
    return await this.authRepository.findSessionByUserIdAndUserAgent(
      userId,
      userAgent,
    );
  }

  async deleteToken(refreshToken: string) {
    return await this.authRepository.deleteRefreshToken(refreshToken);
  }

  async deleteSession(sessionId: string) {
    return await this.authRepository.deleteRefreshTokenFamily(sessionId);
  }

  async deleteAllTokens(userId: string) {
    return await this.authRepository.deleteAllRefreshTokens(userId);
  }
}
