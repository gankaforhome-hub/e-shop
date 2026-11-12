import {
  CMS_AUTH_COOKIE_PATH,
  CMS_REFRESH_TOKEN,
  AuthAudience,
} from '@common/constants';
import {
  Audiences,
  Cookie,
  CurrentUser,
  SkipAuth,
  UserAgent,
} from '@common/decorators';
import { REFRESH_THROTTLE, STRICT_THROTTLE } from '@config';
import { StaffAccessService } from '@modules/staff/staff-access.service';
import { StaffAccountService } from '@modules/staff/staff-account.service';
import { FRESH_ASSERTION_HEADER } from '@modules/staff/staff.constants';
import { WebAuthnService } from '@modules/staff/webauthn.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
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
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { Response } from 'express';
import { CookieService } from '../cookie/cookie.service';
import { AuthService } from './auth.service';
import {
  AssertionOptionsDto,
  ChangePasswordDto,
  EmailDto,
  RegistrationOptionsDto,
  ResetPasswordDto,
  SignInDto,
  VerifyRegistrationDto,
  WebAuthnResponseDto,
} from './dto';
import { CheckOrigin, OriginGuard } from './guards/origin.guard';
import { IAuthUser, ITokens } from './interfaces';
import {
  AcceptInviteResponse,
  MessageResponse,
  SignInResponse,
} from './responses';
import { CmsProfileResponse } from './responses/cms-profile.response';

class CredentialResponse {
  credentialId: string;
}

@ApiTags('🛡️ cms auth')
@ApiBearerAuth()
@Audiences(AuthAudience.CMS)
@Controller('auth/cms')
export class CmsAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly webAuthnService: WebAuthnService,
    private readonly staffAccess: StaffAccessService,
    private readonly staffAccount: StaffAccountService,
    private readonly cookieService: CookieService,
  ) {}

  private async setRefreshCookie({ refreshToken }: ITokens, res: Response) {
    await this.cookieService.setToCookies(
      {
        name: CMS_REFRESH_TOKEN,
        value: refreshToken.token,
        expires: refreshToken.expires,
        path: CMS_AUTH_COOKIE_PATH,
      },
      res,
    );
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @CheckOrigin(AuthAudience.CMS)
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({
    summary: 'first step of a staff sign-in: email and password',
    description:
      'Without a key the session is ready at once; a staff member who added a key confirms the session with it (webauthn/*) before it can do anything.',
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const tokens = await this.authService.signInCms(signInDto, userAgent);
    await this.setRefreshCookie(tokens, res);
    return { accessToken: tokens.accessToken };
  }

  @SkipAuth()
  @Throttle(REFRESH_THROTTLE)
  @CheckOrigin(AuthAudience.CMS)
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'refresh a staff session' })
  async refresh(
    @Cookie(CMS_REFRESH_TOKEN) refreshToken: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshToken(
      refreshToken,
      userAgent,
      AuthAudience.CMS,
    );
    await this.setRefreshCookie(tokens, res);
    return { accessToken: tokens.accessToken };
  }

  @SkipAuth()
  @CheckOrigin(AuthAudience.CMS)
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-out')
  @ApiOperation({ summary: 'end a staff session' })
  async signOut(
    @Cookie(CMS_REFRESH_TOKEN) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (refreshToken) {
      await this.authService.deleteToken(refreshToken, AuthAudience.CMS);
    }
    await this.cookieService.removeFromCookies(
      CMS_REFRESH_TOKEN,
      res,
      CMS_AUTH_COOKIE_PATH,
    );
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('accept-invite')
  @ApiOperation({
    summary:
      'accept a CMS invitation: set the password with the token from the link',
    description:
      'Also confirms the email and ends every session. Returns the email, so the CMS signs the person in right away.',
  })
  async acceptInvite(
    @Body() { token, password }: ResetPasswordDto,
  ): Promise<AcceptInviteResponse> {
    return { email: await this.staffAccount.acceptInvite(token, password) };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('forgot-password')
  @ApiOperation({
    summary: 'send a staff password reset link (opens the CMS)',
    description: 'The same answer for unknown and revoked addresses.',
  })
  async forgotPassword(@Body() { email }: EmailDto): Promise<MessageResponse> {
    await this.staffAccount.forgotPassword(email);
    return { message: 'Check your email for the next step' };
  }

  @SkipAuth()
  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({
    summary: 'set a new staff password with the token from the link',
    description: 'Ends every session; keys and the role stay.',
  })
  async resetPassword(
    @Body() { token, password }: ResetPasswordDto,
  ): Promise<MessageResponse> {
    await this.staffAccount.resetPassword(token, password);
    return { message: 'Password changed, sign in again' };
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @ApiOperation({
    summary: 'change the own staff password',
    description:
      'Needs a usable CMS session (key-confirmed when the account has a key). Ends every other session.',
  })
  async changePassword(
    @CurrentUser() user: IAuthUser,
    @Body() { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<MessageResponse> {
    if (!this.staffAccess.isActive(user)) {
      throw new ForbiddenException();
    }
    await this.staffAccount.changePassword(user, currentPassword, newPassword);
    return { message: 'Password changed' };
  }

  @Get('me')
  @ApiOperation({
    summary: 'profile and role of the signed-in staff member',
    description:
      'Identifies the session and tells the CMS whether the key step is left (hasKey without keyConfirmed). Routes that change data have their own guards.',
  })
  me(@CurrentUser() user: IAuthUser): CmsProfileResponse {
    if (!user.staff || user.staff.revokedAt) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.staff.role,
      hasKey: user.hasKey,
      keyConfirmed: user.aal >= 2,
      isRoot: this.staffAccess.isRoot(user),
    };
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('webauthn/options')
  @ApiOperation({ summary: 'second step of a staff sign-in: key challenge' })
  loginOptions(
    @CurrentUser() user: IAuthUser,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return this.webAuthnService.createLoginOptions(user);
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('webauthn/verify')
  @ApiOperation({
    summary: 'raise the session to aal 2 with a key signature',
    description: 'Returns a new access token; the previous one stops working.',
  })
  async verifyLogin(
    @CurrentUser() user: IAuthUser,
    @Body() { response }: WebAuthnResponseDto,
    @Ip() ip: string,
  ): Promise<SignInResponse> {
    const credentialId = await this.webAuthnService.verifyLogin(
      user,
      response as unknown as AuthenticationResponseJSON, // checked by the WebAuthn library
      ip,
    );
    const accessToken = await this.authService.elevateSession(
      user,
      credentialId,
    );
    return { accessToken };
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('webauthn/assertion-options')
  @ApiOperation({
    summary: 'key challenge for one sensitive action on one target',
    description: `Sign it and send the result, as base64url JSON, in the ${FRESH_ASSERTION_HEADER} header of that action. For webauthn.add_key the target is your own id.`,
  })
  assertionOptions(
    @CurrentUser() user: IAuthUser,
    @Body() { action, targetId }: AssertionOptionsDto,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return this.webAuthnService.createAssertionOptions(user, action, targetId);
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('webauthn/register/options')
  @ApiOperation({
    summary: 'challenge for registering a key',
    description:
      'The first key is added from the password session (a root also sends ROOT_ENROLLMENT_CODE); another key needs an aal 2 session.',
  })
  registrationOptions(
    @CurrentUser() user: IAuthUser,
    @Body() { enrollmentCode }: RegistrationOptionsDto,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    return this.webAuthnService.createRegistrationOptions(user, enrollmentCode);
  }

  @Throttle(STRICT_THROTTLE)
  @Post('webauthn/register/verify')
  @ApiOperation({
    summary: 'register a key',
    description: `For every key after the first, the ${FRESH_ASSERTION_HEADER} header must confirm the webauthn.add_key action. A root admin adds the returned id to ROOT_CREDENTIAL_IDS.`,
  })
  async verifyRegistration(
    @CurrentUser() user: IAuthUser,
    @Body() { response, enrollmentCode }: VerifyRegistrationDto,
    @Headers(FRESH_ASSERTION_HEADER) freshAssertion: string | undefined,
    @Ip() ip: string,
  ): Promise<CredentialResponse> {
    const credentialId = await this.webAuthnService.verifyRegistration(
      user,
      response as unknown as RegistrationResponseJSON, // checked by the WebAuthn library
      enrollmentCode,
      freshAssertion,
      ip,
    );
    return { credentialId };
  }
}
