import { hasLocale } from 'next-intl';

import { type Locale, locales } from '../routing';

export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && hasLocale(locales, locale);
}
