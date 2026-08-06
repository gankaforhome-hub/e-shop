import { defineRouting } from 'next-intl/routing';

export const locales = ['ua', 'en'] as const;

export type Locale = (typeof locales)[number];

export interface ILanguageOption {
  code: Locale;
  label: string;
}

export const defaultLocale: Locale = 'ua';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
