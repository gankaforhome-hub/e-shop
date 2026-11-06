import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { UserService } from '@modules/user/user.service';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { IJwtPayload, ITokens } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  private async generateTokens(
    user: User,
    userAgent: string,
  ): Promise<ITokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

    const refreshToken = await this.authRepository.setRefreshToken(
      user.id,
      userAgent,
    );

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return { accessToken, refreshToken };
  }

  //COMMENT sign up by email, password, repeat password
  async signUp(signUpDto: SignUpDto) {
    const user: User | null = await this.userService.findOneByIdOrEmail(
      signUpDto.email,
    );

    if (user) {
      throw new ConflictException('User with this email is already registered');
    }
    return this.userService.create(signUpDto);
  }

  //COMMENT sign in by email, password
  async signIn(signInDto: SignInDto, userAgent: string): Promise<ITokens> {
    const user: User | null = await this.userService.findOneByIdOrEmail(
      signInDto.email,
      true,
    );

    if (!user) {
      throw new UnauthorizedException('Email or password are invalid');
    }

    if (user.password && !compareSync(signInDto.password, user.password)) {
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
    userAgent: string,
  ): Promise<ITokens> {
    //COMMENTS we delete token, if token does not return - token is absent in db
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const token = await this.authRepository.deleteRefreshToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }

    if (new Date(token.expires) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByIdOrEmail(token.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.generateTokens(user, userAgent);
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

  async deleteAllTokens(user: IJwtPayload) {
    return await this.authRepository.deleteAllRefreshTokens(user);
  }
}
