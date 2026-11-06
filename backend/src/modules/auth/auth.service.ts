import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { PasswordService } from '@modules/password/password.service';
import { UserService } from '@modules/user/user.service';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { IJwtPayload, ITokens } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  private signAccessToken({ userId, familyId }: Token): string {
    const payload: IJwtPayload = { id: userId, sid: familyId };
    return this.jwtService.sign(payload);
  }

  private async generateTokens(
    user: User,
    userAgent?: string,
  ): Promise<ITokens> {
    const refreshToken = await this.authRepository.setRefreshToken(
      user.id,
      userAgent,
    );

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return { accessToken: this.signAccessToken(refreshToken), refreshToken };
  }

  //COMMENT sign up by email, password, repeat password
  async signUp(signUpDto: SignUpDto) {
    const user: User | null = await this.userService.findOneByEmail(
      signUpDto.email,
    );

    if (user) {
      throw new ConflictException('User with this email is already registered');
    }
    return this.userService.create(signUpDto);
  }

  //COMMENT sign in by email, password
  async signIn(signInDto: SignInDto, userAgent?: string): Promise<ITokens> {
    const user: User | null = await this.userService.findOneByEmail(
      signInDto.email,
    );

    const isPasswordValid = await this.passwordService.isPasswordValid(
      signInDto.password,
      user?.password,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Email or password are invalid');
    }
    const tokens: ITokens = await this.generateTokens(user, userAgent);

    return tokens;
  }

  //COMMENT sign in by email, password
  async signOut(refreshToken: string): Promise<Token | null> {
    return await this.authRepository.deleteRefreshToken(refreshToken);
  }

  //COMMENT get refresh token
  async refreshToken(
    refreshToken: string,
    userAgent?: string,
  ): Promise<ITokens> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    //COMMENT null: the token is unknown, expired or reused
    const token = await this.authRepository.rotateRefreshToken(
      refreshToken,
      userAgent,
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
