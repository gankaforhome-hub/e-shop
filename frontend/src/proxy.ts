import { type NextRequest, NextResponse } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Accurate interceptor для /ua та /ua/...
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
