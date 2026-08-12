import { defineRouting } from 'next-intl/routing';

export const locales = ['uk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'uk';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // localeCookie: {
  //   name: 'lang',
  //   maxAge: 31536000,
  // },
});

export interface ILanguageOption {
  code: Locale;
  codeTitle: string;
  codeLabel: string;
  ariaLabel: string;
}
