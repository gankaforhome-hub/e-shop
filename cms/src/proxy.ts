import { type NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/** Locale routing (`uk` without prefix, `/en/...`). Auth guards will hook in here. */
export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
