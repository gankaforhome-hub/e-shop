import type AboutPageDict from '@/dictionaries/en/about.json';
import type CommonDictionary from '@/dictionaries/en/common.json';
import type HomePageDict from '@/dictionaries/en/home.json';
import type LayoutDict from '@/dictionaries/en/layout.json';
// import type HomePageDict from '@/dictionaries/en/home_page.json';
// import type ProductPageDict from '@/dictionaries/en/product_page.json';

import { type Locale } from './locales';
import { type PageDictionaryName, type PageToDictionaryMap } from './types';

type DictionaryLoaders = {
  common: () => Promise<{ default: typeof CommonDictionary }>; // home_page: () => Promise<{ default: typeof HomePageDict }>;
  layout: () => Promise<{ default: typeof LayoutDict }>;
  home: () => Promise<{ default: typeof HomePageDict }>;
  about: () => Promise<{ default: typeof AboutPageDict }>;
  // category_page: () => Promise<{ default: typeof CategoryPageDict }>;
};

export const dictionaries: Record<Locale, DictionaryLoaders> = {
  en: {
    common: () => import('@/dictionaries/en/common.json'),
    layout: () => import('@/dictionaries/en/layout.json'),
    home: () => import('@/dictionaries/en/home.json'),
    about: () => import('@/dictionaries/en/about.json'),
    // product_page: () => import('@/dictionaries/en/product_page.json'),
    // category_page: () => import('@/dictionaries/en/category_page.json'),
  },
  ua: {
    common: () => import('@/dictionaries/ua/common.json'),
    layout: () => import('@/dictionaries/ua/layout.json'),
    home: () => import('@/dictionaries/ua/home.json'),
    about: () => import('@/dictionaries/ua/about.json'),

    // product_page: () => import('@/dictionaries/ua/product_page.json'),
    // category_page: () => import('@/dictionaries/ua/category_page.json'),
  },
};

/**
 * Asynchronously loads and merges localization dictionaries for a specific page context and locale.
 * Strictly enforces that only dictionary keys associated with the given page type can be passed.
 *
 * @template P - A valid page dictionary identifier extending {@link PageDictionaryName}.
 *
 * @param locale - The target language/locale identifier (e.g., `'en'`, `'ua'`).
 * @param names - An array of dictionary keys strictly constrained to the selected page context (`PageToDictionaryMap[P]`).
 *
 * @returns A promise that resolves to a merged key-value dictionary object containing all requested translations.
 *
 * @example
 * // Loading common layout and home page translations:
 * const homeDict = await getDictionary<'home_page'>('en', ['common', 'layout', 'home_page']);
 *
 * @example
 * // Type Error: 'product_page' is not allowed for 'home_page' context
 * // const invalid = await getDictionary<'home_page'>('en', ['common', 'product_page']);
 */
export async function getDictionary<P extends PageDictionaryName>(
  //INFO A temporary function that works for those files that are already filled and entered in Dictionary Loaders
  locale: Locale,
  names: readonly PageToDictionaryMap[P][],
) {
  const result: Record<string, unknown> = {};
  const currentLocaleDict = dictionaries[locale];

  await Promise.all(
    names.map(async name => {
      // Приводимо `name` до типів КЛЮЧІВ, які реально є в об'єкті прямо зараз
      const dictKey = name as unknown as keyof typeof currentLocaleDict;
      const loader = currentLocaleDict[dictKey];

      // Перевіряємо, чи існує завантажувач (на випадок, якщо файл ще не створено/закоментовано)
      if (typeof loader === 'function') {
        const dictionary = await loader();
        Object.assign(result, dictionary.default);
      }
    }),
  );

  return result;
}

// export async function getDictionary<P extends PageDictionaryName>(
//   locale: Locale,
//   names: readonly PageToDictionaryMap[P][],
// ) {
//   const result: Record<string, unknown> = {};

//   await Promise.all(
//     names.map(async name => {
//       const loader = dictionaries[locale][name as DictionaryName];

//       if (loader) {
//         const dictionary = await loader();
//         Object.assign(result, dictionary.default);
//       }
//     }),
//   );

//   return result;
// }
