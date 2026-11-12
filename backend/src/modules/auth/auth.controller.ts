import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { E_AuthAudience } from '@prisma/client';

import {
  CMS_AUTH_COOKIE_PATH,
  CMS_REFRESH_TOKEN,
  REFRESH_TOKEN,
} from '@common/constants';
import {
  AnyAudience,
  Cookie,
  CurrentUser,
  SkipAuth,
  UserAgent,
} from '@common/decorators';
import { REFRESH_THROTTLE, STRICT_THROTTLE } from '@config';
import { CookieService } from '../cookie/cookie.service';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';

import {
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmEmailChangeDto,
  EmailDto,
  GoogleSignInDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto';
import { CheckOrigin, OriginGuard } from './guards/origin.guard';
import { IAuthUser, ITokens } from './interfaces';
import {
  AcceptInviteResponse,
  ApiSignInBadRequestResponse,
  ApiSignInCreatedResponse,
  ApiSignInOperation,
  ApiSignInUnauthorizedResponse,
  ApiSignOutOkResponse,
  ApiSignOutOperation,
  ApiSignOutUnauthorizedResponse,
  ApiSignUpAcceptedResponse,
  ApiSignUpBadRequestResponse,
  ApiSignUpOperation,
  MessageResponse,
  SignInResponse,
} from './responses';

//COMMENT the same for existing and unknown emails, so it does not reveal which accounts exist
const CHECK_EMAIL_MESSAGE = 'Check your email for the next step';

@ApiTags('⛔ auth service')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly cookiesService: CookieService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('sign-up')
  @ApiSignUpOperation()
  @ApiSignUpAcceptedResponse()
  @ApiSignUpBadRequestResponse()
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    await this.accountService.signUp(signUpDto, ip);
    return { message: CHECK_EMAIL_MESSAGE };
  }

  @ApiBearerAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('resend-verification')
  @ApiOperation({
    summary: 'send the email verification link again',
    description: 'To the own email of the signed-in customer.',
  })
  async resendVerification(
    @CurrentUser() user: IAuthUser,
  ): Promise<MessageResponse> {
    await this.accountService.resendVerification(user);
    return { message: CHECK_EMAIL_MESSAGE };
  }

  @ApiBearerAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  @ApiOperation({
    summary: 'confirm the email with the token from the link',
    description:
      'Needs the session of the account the link was sent for: the owner of a mailbox can never confirm an account someone else created with that address.',
  })
  async verifyEmail(
    @CurrentUser() user: IAuthUser,
    @Body() dto: VerifyEmailDto,
  ): Promise<MessageResponse> {
    await this.accountService.verifyEmail(user, dto);
    return { message: 'Email confirmed' };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('forgot-password')
  @ApiOperation({ summary: 'send a password reset link' })
  async forgotPassword(
    @Body() dto: EmailDto,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    await this.accountService.forgotPassword(dto, ip);
    return { message: CHECK_EMAIL_MESSAGE };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({
    summary: 'set a new password with the token from the link',
    description: 'Ends every session of the user.',
  })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponse> {
    await this.accountService.resetPassword(dto);
    return { message: 'Password changed, sign in again' };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('accept-invite')
  @ApiOperation({
    summary:
      'accept a CMS invitation: set the password with the token from the link',
    description:
      'Also confirms the email. Ends every session of the user. An existing password is replaced. Returns the email, so the CMS signs the person in right away.',
  })
  async acceptInvite(
    @Body() dto: ResetPasswordDto,
  ): Promise<AcceptInviteResponse> {
    const email = await this.accountService.acceptStaffInvite(dto);
    return { email };
  }

  @ApiBearerAuth()
  @AnyAudience()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @ApiOperation({
    summary: 'change the password',
    description: 'Ends every other session of the user.',
  })
  async changePassword(
    @CurrentUser() user: IAuthUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<MessageResponse> {
    await this.accountService.changePassword(user, dto);
    return { message: 'Password changed' };
  }

  @ApiBearerAuth()
  @AnyAudience()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('change-email')
  @ApiOperation({
    summary: 'request an email change',
    description:
      'The change applies once both the old and the new address confirm it.',
  })
  async changeEmail(
    @CurrentUser() user: IAuthUser,
    @Body() dto: ChangeEmailDto,
  ): Promise<MessageResponse> {
    await this.accountService.changeEmail(user, dto);
    return { message: CHECK_EMAIL_MESSAGE };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('confirm-email-change')
  @ApiOperation({
    summary: 'confirm an email change with the token from the link',
    description: 'Ends every session of the user once the change applies.',
  })
  async confirmEmailChange(
    @Body() dto: ConfirmEmailChangeDto,
  ): Promise<MessageResponse> {
    const isChanged = await this.accountService.confirmEmailChange(dto);
    return {
      message: isChanged
        ? 'Email changed, sign in again'
        : 'Confirmed, now confirm the other address too',
    };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @CheckOrigin(E_AuthAudience.STOREFRONT)
  @UseGuards(OriginGuard)
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
  @Throttle(STRICT_THROTTLE)
  @CheckOrigin(E_AuthAudience.STOREFRONT)
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.OK)
  @Post('google')
  @ApiOperation({
    summary: 'storefront sign-in with Google (authorization code)',
    description:
      'Merges with the account of the same email (Google wins: an unverified account loses its password and sessions) and verifies the email. 404 while GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set.',
  })
  async signInWithGoogle(
    @Body() { code, redirectUri }: GoogleSignInDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const {
      accessToken,
      refreshToken: { token, expires },
    } = await this.googleAuthService.signIn(code, redirectUri, userAgent);
    await this.cookiesService.setToCookies(
      { name: REFRESH_TOKEN, value: token, expires },
      res,
    );
    return { accessToken };
  }

  @SkipAuth()
  @CheckOrigin(E_AuthAudience.STOREFRONT)
  @UseGuards(OriginGuard)
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
      await this.cookiesService.removeFromCookies(REFRESH_TOKEN, res);
      res.sendStatus(HttpStatus.NO_CONTENT);
      return;
    }

    await this.authService.deleteToken(refreshToken);

    await this.cookiesService.removeFromCookies(REFRESH_TOKEN, res);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @ApiBearerAuth()
  @AnyAudience()
  @Post('sign-out/all')
  async signOutAllUserAgent(
    @CurrentUser() user: IAuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteAllTokens(user.id);
    await this.cookiesService.removeFromCookies(REFRESH_TOKEN, res);
    await this.cookiesService.removeFromCookies(
      CMS_REFRESH_TOKEN,
      res,
      CMS_AUTH_COOKIE_PATH,
    );
    res.sendStatus(HttpStatus.OK);
  }

  @SkipAuth()
  @Throttle(REFRESH_THROTTLE)
  @CheckOrigin(E_AuthAudience.STOREFRONT)
  @UseGuards(OriginGuard)
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
