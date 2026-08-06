import { getRequestConfig } from 'next-intl/server';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { defaultLocale, locales, type Locale } from '@/shared/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: await getDictionary(['common', 'layout'], locale),
  };
});
