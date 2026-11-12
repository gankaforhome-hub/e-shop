import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV,
  STOREFRONT_ORIGINS,
} from '@common/constants';
import { parseEnvList } from '@common/utils';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ITokens } from './interfaces';
import { AuthRepository } from './repository/auth.repository';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const REQUEST_TIMEOUT_MS = 10_000;

type GoogleClaims = {
  iss?: unknown;
  aud?: unknown;
  exp?: unknown;
  sub?: unknown;
  email?: unknown;
  email_verified?: unknown;
  given_name?: unknown;
  family_name?: unknown;
};

//COMMENT Google may send no names at all; empty or overlong values are ignored
const toName = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() && value.trim().length <= 100
    ? value.trim()
    : undefined;

/**
 * Storefront sign-in with Google (authorization code flow; the storefront owns the redirect).
 * Off (404) until GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set.
 */
@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private getCredentials(): { clientId: string; clientSecret: string } {
    const clientId = this.configService.get<string>(GOOGLE_CLIENT_ID);
    const clientSecret = this.configService.get<string>(GOOGLE_CLIENT_SECRET);
    if (!clientId || !clientSecret) {
      throw new NotFoundException();
    }
    return { clientId, clientSecret };
  }

  //COMMENT the code is bound to the redirect URI; only storefront pages may receive it
  private assertRedirectUri(redirectUri: string): void {
    const origins = parseEnvList(
      this.configService.get<string>(STOREFRONT_ORIGINS),
    );
    const origin = new URL(redirectUri).origin;
    const isAllowed =
      origins.length > 0
        ? origins.includes(origin)
        : this.configService.get(NODE_ENV) !== 'production';
    if (!isAllowed) {
      throw new BadRequestException('Unknown redirect URI');
    }
  }

  /**
   * The id_token comes straight from Google's token endpoint over TLS, server to server, so
   * its signature needs no extra check (Google's OpenID guide); the claims still do.
   */
  private async exchangeCode(
    code: string,
    redirectUri: string,
  ): Promise<{
    sub: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }> {
    const { clientId, clientSecret } = this.getCredentials();

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }).catch((err: unknown) => {
      this.logger.error('Google is unreachable', err);
      return null;
    });
    const body = (await response?.json().catch(() => null)) as {
      id_token?: unknown;
    } | null;
    if (!response?.ok || typeof body?.id_token !== 'string') {
      throw new BadRequestException('Google sign-in failed');
    }

    let claims: GoogleClaims;
    try {
      claims = JSON.parse(
        Buffer.from(body.id_token.split('.')[1] ?? '', 'base64url').toString(),
      ) as GoogleClaims;
    } catch {
      throw new BadRequestException('Google sign-in failed');
    }

    const isValid =
      GOOGLE_ISSUERS.includes(claims.iss as string) &&
      claims.aud === clientId &&
      typeof claims.exp === 'number' &&
      claims.exp * 1000 > Date.now() &&
      typeof claims.sub === 'string' &&
      typeof claims.email === 'string' &&
      claims.email_verified === true;
    if (!isValid) {
      throw new BadRequestException(
        'Google did not confirm this email address',
      );
    }
    return {
      sub: claims.sub as string,
      email: claims.email as string,
      firstName: toName(claims.given_name),
      lastName: toName(claims.family_name),
    };
  }

  async signIn(
    code: string,
    redirectUri: string,
    userAgent?: string,
  ): Promise<ITokens> {
    this.getCredentials();
    this.assertRedirectUri(redirectUri);

    const { sub, email, firstName, lastName } = await this.exchangeCode(
      code,
      redirectUri,
    );
    const user = await this.authRepository.linkGoogleAccount(sub, email, {
      firstName,
      lastName,
    });
    await this.userService.clearCache(user.id);

    return this.authService.signInVerifiedUser(user, userAgent);
  }
}
