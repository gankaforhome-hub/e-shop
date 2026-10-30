import { type CommonDict } from './types';

/**
 * `common` sections read by client `useTranslations`. Everything else stays on
 * the server, so `NextIntlClientProvider` doesn't inline it into every page's
 * RSC payload. Add a section here when a client component starts using it.
 */
const CLIENT_COMMON_KEYS = [
  'common',
  'search',
  'favorites',
  'cart',
  'checkout',
  'catalog',
  'forms',
  'placeholder',
  'navigation',
  'notFound',
  'subscribe',
  'label',
  'action',
] as const satisfies readonly (keyof CommonDict)[];

type ClientCommonKey = (typeof CLIENT_COMMON_KEYS)[number];

export function pickClientMessages(common: CommonDict): {
  common: Pick<CommonDict, ClientCommonKey>;
} {
  // Object.fromEntries widens keys to string; the entries come from CLIENT_COMMON_KEYS
  const picked = Object.fromEntries(
    CLIENT_COMMON_KEYS.map(key => [key, common[key]]),
  ) as Pick<CommonDict, ClientCommonKey>;

  return { common: picked };
}
