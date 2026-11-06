import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';

import { REFRESH_TOKEN } from '@common/constants';
import { Cookie, CurrentUser, SkipAuth, UserAgent } from '@common/decorators';
import { CookieService } from '../cookie/cookie.service';
import { AuthService } from './auth.service';

import { UserResponse } from '../user/responses/user.response';
import { SignInDto, SignUpDto } from './dto';
import { IJwtPayload, ITokens } from './interfaces';
import {
  ApiSignInBadRequestResponse,
  ApiSignInCreatedResponse,
  ApiSignInOperation,
  ApiSignInUnauthorizedResponse,
  ApiSignOutOkResponse,
  ApiSignOutOperation,
  ApiSignOutUnauthorizedResponse,
  ApiSignUpBadRequestResponse,
  ApiSignUpConflictResponse,
  ApiSignUpCreatedResponse,
  ApiSignUpOperation,
} from './responses';

@ApiTags('⛔ auth service')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookiesService: CookieService,
  ) {}

  @SkipAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-up')
  @ApiSignUpOperation()
  @ApiSignUpCreatedResponse()
  @ApiSignUpBadRequestResponse()
  @ApiSignUpConflictResponse()
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    const user = await this.authService.signUp(signUpDto);
    if (!user) {
      throw new BadRequestException('Unable to sign up');
    }
    return new UserResponse(user);
  }

  @SkipAuth()
  @Post('sign-in')
  @ApiSignInOperation()
  @ApiSignInCreatedResponse()
  @ApiSignInBadRequestResponse()
  @ApiSignInUnauthorizedResponse()
  async signIn(
    @Body() signInDto: SignInDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(signInDto, userAgent);
    if (!tokens) {
      throw new BadRequestException('Unable to sign in');
    }
    const {
      accessToken,
      refreshToken: { token, expires },
    } = tokens;
    await this.cookiesService.setToCookies(
      {
        name: REFRESH_TOKEN,
        value: token,
        expires,
      },
      res,
    );
    res.status(HttpStatus.CREATED).json({
      accessToken,
    });
  }

  @SkipAuth()
  @Post('sign-out')
  @ApiSignOutOperation()
  @ApiSignOutOkResponse()
  @ApiSignOutUnauthorizedResponse()
  async signOut(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Refresh token is absent',
        error: 'Unauthorized',
        statusCode: 401,
      });
      return;
    }

    //COMMENT if user sign-out early
    const isExistToken = await this.authService.findToken(refreshToken);
    if (!isExistToken) {
      res.sendStatus(HttpStatus.NO_CONTENT);
      return;
    }

    await this.authService.deleteToken(refreshToken);

    await this.cookiesService.removeFromCookies(REFRESH_TOKEN, res);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @ApiBearerAuth()
  @Post('sign-out/all')
  async signOutAllUserAgent(
    @CurrentUser() user: IJwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteAllTokens(user.id);
    await this.cookiesService.removeFromCookies(REFRESH_TOKEN, res);
    res.sendStatus(HttpStatus.OK);
  }

  @SkipAuth()
  @Post('refresh')
  @ApiOperation({ summary: '🔃 refresh token' })
  async refreshToken(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
  ) {
    //COMMENT if token exists or delete from cookies independently
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens: ITokens = await this.authService.refreshToken(
      refreshToken,
      userAgent,
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }

    const {
      accessToken,
      refreshToken: { token, expires },
    } = tokens;

    await this.cookiesService.setToCookies(
      {
        name: REFRESH_TOKEN,
        value: token,
        expires,
      },
      res,
    );
    res.status(HttpStatus.CREATED).json({
      accessToken,
    });
  }
}
