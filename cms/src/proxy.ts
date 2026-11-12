import { NextResponse, type NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { refreshSessionRequest } from '@/shared/api/auth-api';
import { routes } from '@/shared/config';
import { locales, routing } from '@/shared/i18n/routing';
import {
  ACCESS_TOKEN_COOKIE,
  getSessionCookies,
  REFRESH_TOKEN_COOKIE,
} from '@/shared/lib/session/session-cookies';

const handleI18nRouting = createMiddleware(routing);

const LOCALE_PREFIX = new RegExp(`^/(${locales.join('|')})(?=/|$)`);
const PUBLIC_PATHS: readonly string[] = Object.values(routes.auth);

/**
 * Locale routing (`uk` without prefix, `/en/...`) and the gate of the whole CMS:
 * every page except sign-in, the invitation and the password reset needs a session.
 * The cookie is only checked for presence here; `getCurrentUser` has the API verify it.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = LOCALE_PREFIX.exec(pathname)?.[0] ?? '';
  const path = pathname.slice(prefix.length) || routes.home;

  if (PUBLIC_PATHS.includes(path) || request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return handleI18nRouting(request);
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const result = refreshToken
    ? await refreshSessionRequest(refreshToken)
    : null;

  if (result?.ok) {
    const cookies = getSessionCookies(result.data);
    // This render must see the new token too, not only the next request
    cookies.forEach(({ name, value }) => request.cookies.set(name, value));

    const response = handleI18nRouting(request);
    cookies.forEach(cookie => response.cookies.set(cookie));
    return response;
  }

  const loginUrl = new URL(`${prefix}${routes.auth.login}`, request.url);
  const response = NextResponse.redirect(loginUrl);

  // A rejected token is gone for good; keep it when the API was only unreachable
  if (result?.status === 401) {
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
