import { unstable_rethrow } from 'next/navigation';
import { lang as rootLang } from 'next/root-params';

import { getRequestConfig } from 'next-intl/server';

import { isValidLocale } from './is-valid-locale';
import { loadMessages } from './messages';
import { defaultLocale } from './routing';

/**
 * Locale comes from the `[lang]` root param, so routes stay static without
 * `setRequestLocale`. `next/root-params` is unavailable in Server Actions;
 * there we fall back to next-intl's `requestLocale` (proxy header).
 */
export default getRequestConfig(async params => {
  let locale: string | undefined;
  try {
    locale = await rootLang();
  } catch (error) {
    // Let Next.js control-flow errors (postpone, dynamic usage) propagate
    unstable_rethrow(error);
    // Read lazily: accessing `params.requestLocale` triggers a headers() lookup,
    // so it must not be destructured in the signature.
    locale = await params.requestLocale;
  }

  const resolvedLocale = isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: await loadMessages(resolvedLocale),
  };
});
