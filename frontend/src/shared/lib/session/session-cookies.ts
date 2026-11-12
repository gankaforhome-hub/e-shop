/**
 * The customer session lives in httpOnly cookies of the storefront itself: the API refresh
 * cookie is bound to the API host, so `proxy.ts` could not see it, and page scripts can't
 * read either token. Mirrors `cms/src/shared/lib/session` with its own cookie names.
 */
export const ACCESS_TOKEN_COOKIE = 'sf_access';
export const REFRESH_TOKEN_COOKIE = 'sf_refresh';

// Refresh slightly before the token expires, not after a request has failed
const ACCESS_TOKEN_MARGIN_SECONDS = 5;
const FALLBACK_ACCESS_TOKEN_SECONDS = 60;

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  refreshExpires: Date;
};

/** Only sets the cookie lifetime; the API verifies the token itself. */
function getAccessTokenMaxAge(accessToken: string): number {
  try {
    const payload: unknown = JSON.parse(
      Buffer.from(accessToken.split('.')[1] ?? '', 'base64url').toString(),
    );
    const exp =
      payload && typeof payload === 'object' && 'exp' in payload
        ? Number(payload.exp)
        : NaN;
    const seconds = Math.floor(exp - Date.now() / 1000);

    return seconds > ACCESS_TOKEN_MARGIN_SECONDS
      ? seconds - ACCESS_TOKEN_MARGIN_SECONDS
      : FALLBACK_ACCESS_TOKEN_SECONDS;
  } catch {
    return FALLBACK_ACCESS_TOKEN_SECONDS;
  }
}

const getCookieOptions = () =>
  ({
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  }) as const;

export function getSessionCookies({
  accessToken,
  refreshToken,
  refreshExpires,
}: SessionTokens) {
  return [
    {
      ...getCookieOptions(),
      name: ACCESS_TOKEN_COOKIE,
      value: accessToken,
      maxAge: getAccessTokenMaxAge(accessToken),
    },
    {
      ...getCookieOptions(),
      name: REFRESH_TOKEN_COOKIE,
      value: refreshToken,
      expires: refreshExpires,
    },
  ];
}
