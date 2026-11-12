import { randomBytes } from 'node:crypto';

import { type NextRequest, NextResponse } from 'next/server';

import 'server-only';

import { googleSignInRequest } from '@/shared/api/auth-api';
import { apiRoutes, routes } from '@/shared/config/routes';
import { getPathname } from '@/shared/i18n/navigation';
import { defaultLocale, locales, type Locale } from '@/shared/i18n/routing';
import { getSessionCookies } from '@/shared/lib/session';

//INFO Google sign-in (authorization code flow). The storefront owns the redirect: the browser
//INFO goes to Google and back to our callback, and the code is exchanged by the API.

const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const STATE_COOKIE = 'sf_google_state';
const STATE_MAX_AGE_SECONDS = 10 * 60;

/** The button shows only when Google sign-in is configured (server env). */
export const isGoogleSignInEnabled = () => !!process.env.GOOGLE_CLIENT_ID;

const getSiteOrigin = () =>
  new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin;

const getRedirectUri = () => `${getSiteOrigin()}${apiRoutes.googleCallback}`;

const toLocale = (value: string | null | undefined): Locale =>
  locales.find(locale => locale === value) ?? defaultLocale;

const pageUrl = (
  href: typeof routes.signIn | typeof routes.account,
  locale: Locale,
) => new URL(getPathname({ href, locale }), getSiteOrigin());

/** `GET /api/auth/google/start?lang=` → Google consent screen; the state cookie stops CSRF. */
export function startGoogleSignIn(request: Request): NextResponse {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new NextResponse(null, { status: 404 });
  }

  const locale = toLocale(new URL(request.url).searchParams.get('lang'));
  const state = randomBytes(32).toString('base64url');
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  }).toString();

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: STATE_COOKIE,
    value: `${state}.${locale}`,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: apiRoutes.googleCallback,
    maxAge: STATE_MAX_AGE_SECONDS,
  });
  return response;
}

/** `GET /api/auth/google/callback` → session cookies → the account page (or back to sign-in). */
export async function finishGoogleSignIn(
  request: NextRequest,
): Promise<NextResponse> {
  const params = new URL(request.url).searchParams;
  const [savedState, savedLocale] =
    request.cookies.get(STATE_COOKIE)?.value.split('.') ?? [];
  const locale = toLocale(savedLocale);
  const code = params.get('code');

  const fail = () => {
    const response = NextResponse.redirect(pageUrl(routes.signIn, locale));
    response.cookies.delete({
      name: STATE_COOKIE,
      path: apiRoutes.googleCallback,
    });
    return response;
  };

  if (!code || !savedState || params.get('state') !== savedState) {
    return fail();
  }

  const result = await googleSignInRequest({
    code,
    redirectUri: getRedirectUri(),
  });
  if (!result.ok) {
    return fail();
  }

  const response = NextResponse.redirect(pageUrl(routes.account, locale));
  getSessionCookies(result.data).forEach(cookie =>
    response.cookies.set(cookie),
  );
  response.cookies.delete({
    name: STATE_COOKIE,
    path: apiRoutes.googleCallback,
  });
  return response;
}
