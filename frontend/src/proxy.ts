import { type NextRequest, NextResponse } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { refreshSessionRequest } from '@/shared/api/auth-api';
import { routing } from '@/shared/i18n/routing';
import {
  ACCESS_TOKEN_COOKIE,
  getSessionCookies,
  REFRESH_TOKEN_COOKIE,
} from '@/shared/lib/session';

const handleI18nRouting = createMiddleware(routing);

//with geo
// export default function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const geoCountry =
//     request.headers.get('cf-ipcountry')?.toLowerCase() || // Cloudflare
//     request.headers.get('x-geo-country')?.toLowerCase() || // Nginx / Custom Proxy
//     request.headers.get('x-country-code')?.toLowerCase() || // Fastly / AWS / DigitalOcean
//     request.headers.get('x-vercel-ip-country')?.toLowerCase() || // Vercel
//     'ua';

//   if (pathname === '/ua' || pathname.startsWith('/ua/')) {
//     const newPathname = pathname.replace(/^\/ua(\/|$)/, '/uk$1');
//     const url = request.nextUrl.clone();
//     url.pathname = newPathname;

//     const redirectResponse = NextResponse.redirect(url, 301);
//     redirectResponse.cookies.set('user-country', geoCountry, {
//       path: '/',
//       maxAge: 60 * 60 * 24 * 30, // 30 днів
//       sameSite: 'lax',
//     });
//     return redirectResponse;
//   }

//   const response = handleI18nRouting(request);

//   const currentCookie = request.cookies.get('user-country')?.value;
//   if (currentCookie !== geoCountry) {
//     response.cookies.set('user-country', geoCountry, {
//       path: '/',
//       maxAge: 60 * 60 * 24 * 30,
//       sameSite: 'lax',
//     });
//   }

//   return response;
// }

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Accurate interceptor for /ua та /ua/...
  if (pathname === '/ua' || pathname.startsWith('/ua/')) {
    // Replaces only the independent segment /ua
    const newPathname = pathname.replace(/^\/ua(\/|$)/, '/uk$1');
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    // 301 Permanent Redirect для SEO (Google will understand the redirect to /uk)
    return NextResponse.redirect(url, 301);
  }

  // Customer session: the access token expired but the refresh token is there, so renew it
  // silently. Visitors without a session never reach the API from here.
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken || request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return handleI18nRouting(request);
  }

  const result = await refreshSessionRequest(refreshToken);
  if (result.ok) {
    const cookies = getSessionCookies(result.data);
    // This render must see the new token too, not only the next request
    cookies.forEach(({ name, value }) => request.cookies.set(name, value));

    const response = handleI18nRouting(request);
    cookies.forEach(cookie => response.cookies.set(cookie));
    return response;
  }

  const response = handleI18nRouting(request);
  // A rejected token is gone for good; keep it when the API was only unreachable
  if (result.status === 401) {
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
  ],
};
