import { cookies, headers } from 'next/headers';

import 'server-only';

import {
  defaultLocale,
  locales,
  routing,
  type Locale,
} from '@/shared/i18n/routing';

const supportedLocalesSet = new Set<string>(locales);

export async function getPreferredLocale(): Promise<Locale> {
  const cookieStore = await cookies();

  const cookieName =
    typeof routing.localeCookie === 'object' && routing.localeCookie?.name
      ? routing.localeCookie.name
      : 'NEXT_LOCALE';

  const savedLocale = cookieStore.get(cookieName)?.value;

  if (savedLocale && supportedLocalesSet.has(savedLocale)) {
    return savedLocale as Locale;
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language');

  if (acceptLanguage) {
    const headerLower = acceptLanguage.toLowerCase();

    const matchedLocale = locales.find(locale =>
      headerLower.includes(locale.toLowerCase()),
    );

    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return defaultLocale;
}
