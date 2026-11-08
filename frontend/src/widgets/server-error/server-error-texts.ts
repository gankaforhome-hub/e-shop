import { serverError as serverErrorEn } from '@/dictionaries/en/common.json';
import { serverError as serverErrorUk } from '@/dictionaries/uk/common.json';
import { type Locale } from '@/shared/i18n/routing';

import { type ServerErrorTexts } from './server-error';

const SERVER_ERROR_TEXTS = {
  uk: serverErrorUk,
  en: serverErrorEn,
} satisfies Record<Locale, ServerErrorTexts>;

/**
 * Error page strings read straight from the dictionaries. The error pages
 * can't rely on `NextIntlClientProvider` messages (none exist in
 * `global-error`), and keeping them out of the provider keeps these strings
 * out of every page's RSC payload.
 */
export const getServerErrorTexts = (locale: Locale): ServerErrorTexts =>
  SERVER_ERROR_TEXTS[locale];
