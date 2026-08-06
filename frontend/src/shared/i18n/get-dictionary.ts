import 'server-only';

import { getLocale } from 'next-intl/server';

import { defaultLocale, type Locale, locales } from './routing';
import type { GlobalDictionaryName, RawDictionarySchemas } from './types';

const dictionaryLoaders: Record<
  Locale,
  { [K in keyof RawDictionarySchemas]: () => Promise<RawDictionarySchemas[K]> }
> = {
  ua: {
    about: () => import('@/dictionaries/ua/about.json').then(m => m.default),
    common: () => import('@/dictionaries/ua/common.json').then(m => m.default),
    home: () => import('@/dictionaries/ua/home.json').then(m => m.default),
    layout: () => import('@/dictionaries/ua/layout.json').then(m => m.default),
  },
  en: {
    about: () => import('@/dictionaries/en/about.json').then(m => m.default),
    common: () => import('@/dictionaries/en/common.json').then(m => m.default),
    home: () => import('@/dictionaries/en/home.json').then(m => m.default),
    layout: () => import('@/dictionaries/en/layout.json').then(m => m.default),
  },
};

async function resolveLocale(lang?: string): Promise<Locale> {
  if (lang && locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  try {
    // Автоматично беремо активну мову запиту з next-intl
    const currentLocale = await getLocale();
    if (locales.includes(currentLocale as Locale)) {
      return currentLocale as Locale;
    }
  } catch {}

  return defaultLocale;
}

export async function getDictionary<K extends keyof RawDictionarySchemas>(
  namespaces: K[] = [],
  lang?: string,
): Promise<Pick<RawDictionarySchemas, GlobalDictionaryName | K>> {
  const targetLocale = await resolveLocale(lang);

  // Автоматично додаємо базові 'common' та 'layout'
  const baseNamespaces: (keyof RawDictionarySchemas)[] = ['common', 'layout'];
  const uniqueNamespaces = Array.from(
    new Set([...baseNamespaces, ...namespaces]),
  );

  const entries = await Promise.all(
    uniqueNamespaces.map(async ns => {
      const loader = dictionaryLoaders[targetLocale][ns];
      const dict = loader ? await loader() : {};
      return [ns, dict] as const;
    }),
  );

  return Object.fromEntries(entries) as Pick<
    RawDictionarySchemas,
    GlobalDictionaryName | K
  >;
}
