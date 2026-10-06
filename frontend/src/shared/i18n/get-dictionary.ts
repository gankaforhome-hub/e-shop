import { cache } from 'react';

import { notFound } from 'next/navigation';

import 'server-only';

import { getLocale } from 'next-intl/server';

import { defaultLocale, type Locale, locales } from './routing';
import type { GlobalDictionaryName, RawDictionarySchemas } from './types';

const dictionaryLoaders: Record<
  Locale,
  { [K in keyof RawDictionarySchemas]: () => Promise<RawDictionarySchemas[K]> }
> = {
  uk: {
    common: () => import('@/dictionaries/uk/common.json').then(m => m.default),
    layout: () => import('@/dictionaries/uk/layout.json').then(m => m.default),
    home: () => import('@/dictionaries/uk/home.json').then(m => m.default),
    about: () => import('@/dictionaries/uk/about.json').then(m => m.default),
    collections: () =>
      import('@/dictionaries/uk/collections.json').then(m => m.default),
    releases: () =>
      import('@/dictionaries/uk/releases.json').then(m => m.default),
    exclusive: () =>
      import('@/dictionaries/uk/exclusive.json').then(m => m.default),
    contacts: () =>
      import('@/dictionaries/uk/contacts.json').then(m => m.default),
    faq: () => import('@/dictionaries/uk/faq.json').then(m => m.default),
    delivery: () =>
      import('@/dictionaries/uk/delivery.json').then(m => m.default),
    product: () =>
      import('@/dictionaries/uk/product.json').then(m => m.default),
  },
  en: {
    common: () => import('@/dictionaries/en/common.json').then(m => m.default),
    layout: () => import('@/dictionaries/en/layout.json').then(m => m.default),
    home: () => import('@/dictionaries/en/home.json').then(m => m.default),
    about: () => import('@/dictionaries/en/about.json').then(m => m.default),
    collections: () =>
      import('@/dictionaries/en/collections.json').then(m => m.default),
    releases: () =>
      import('@/dictionaries/en/releases.json').then(m => m.default),
    exclusive: () =>
      import('@/dictionaries/en/exclusive.json').then(m => m.default),
    contacts: () =>
      import('@/dictionaries/en/contacts.json').then(m => m.default),
    faq: () => import('@/dictionaries/en/faq.json').then(m => m.default),
    delivery: () =>
      import('@/dictionaries/en/delivery.json').then(m => m.default),
    product: () =>
      import('@/dictionaries/en/product.json').then(m => m.default),
  },
};

export async function resolveLocale(lang?: string): Promise<Locale> {
  if (lang && locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  try {
    const currentLocale = await getLocale();
    if (locales.includes(currentLocale as Locale)) {
      return currentLocale as Locale;
    }
  } catch {
    return defaultLocale;
  }

  return defaultLocale;
}

export const getDictionary = cache(
  async <K extends keyof RawDictionarySchemas>(
    namespaces: K[] = [],
    lang: string,
  ): Promise<Pick<RawDictionarySchemas, GlobalDictionaryName | K>> => {
    const rawLocale = lang || defaultLocale;

    if (!locales.includes(rawLocale as Locale)) {
      notFound();
    }

    const targetLocale = rawLocale as Locale;

    const baseNamespaces: (keyof RawDictionarySchemas)[] = ['common', 'layout'];
    const uniqueNamespaces = Array.from(
      new Set([...baseNamespaces, ...namespaces]),
    );

    const entries = await Promise.all(
      uniqueNamespaces.map(async ns => {
        const loader =
          dictionaryLoaders[targetLocale]?.[ns] ??
          dictionaryLoaders[defaultLocale]?.[ns];

        if (!loader) {
          throw new Error(`Missing dictionary ${ns} for ${targetLocale}`);
        }

        const dict = await loader();
        return [ns, dict] as const;
      }),
    );

    return Object.fromEntries(entries) as Pick<
      RawDictionarySchemas,
      GlobalDictionaryName | K
    >;
  },
);
// export const getDictionary = cache(
//   async <K extends keyof RawDictionarySchemas>(
//     namespaces: K[] = [],
//     lang?: string,
//   ): Promise<Pick<RawDictionarySchemas, GlobalDictionaryName | K>> => {
//     const targetLocale = await resolveLocale(lang);

//     const baseNamespaces: (keyof RawDictionarySchemas)[] = ['common', 'layout'];
//     const uniqueNamespaces = Array.from(
//       new Set([...baseNamespaces, ...namespaces]),
//     );

//     const entries = await Promise.all(
//       uniqueNamespaces.map(async ns => {
//         const loader =
//           dictionaryLoaders[targetLocale]?.[ns] ??
//           dictionaryLoaders[defaultLocale]?.[ns];
//         if (!loader) {
//           throw new Error(`Missing dictionary ${ns} for ${targetLocale}`);
//         }
//         const dict = await loader();
//         return [ns, dict] as const;
//       }),
//     );

//     return Object.fromEntries(entries) as Pick<
//       RawDictionarySchemas,
//       GlobalDictionaryName | K
//     >;
//   },
// );
