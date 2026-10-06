import { type NextRequest, NextResponse } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/i18n/routing';

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

export default function proxy(request: NextRequest) {
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
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
  ],
};
