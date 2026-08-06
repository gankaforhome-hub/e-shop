import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Пропускаємо внутрішні роути Next.js, статичні файли та іконки
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
