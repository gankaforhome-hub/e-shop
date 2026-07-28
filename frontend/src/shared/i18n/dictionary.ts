import type CommonDictionary from '@/dictionaries/en/common.json';
// import type CategoryPageDict from '@/dictionaries/en/category_page.json';
// import type HomePageDict from '@/dictionaries/en/home_page.json';
// import type LayoutDict from '@/dictionaries/en/layout.json';
// import type ProductPageDict from '@/dictionaries/en/product_page.json';

import { type Locale } from './locales';
import { type PageDictionaryName, type PageToDictionaryMap } from './types';

type DictionaryLoaders = {
  common: () => Promise<{ default: typeof CommonDictionary }>; // home_page: () => Promise<{ default: typeof HomePageDict }>;
  // product_page: () => Promise<{ default: typeof ProductPageDict }>;
  // category_page: () => Promise<{ default: typeof CategoryPageDict }>;
};

export const dictionaries: Record<Locale, DictionaryLoaders> = {
  en: {
    common: () => import('@/dictionaries/en/common.json'),
    // layout: () => import('@/dictionaries/en/layout.json'),
    // home_page: () => import('@/dictionaries/en/home_page.json'),
    // product_page: () => import('@/dictionaries/en/product_page.json'),
    // category_page: () => import('@/dictionaries/en/category_page.json'),
  },
  ua: {
    common: () => import('@/dictionaries/ua/common.json'),
    // layout: () => import('@/dictionaries/ua/layout.json'),
    // home_page: () => import('@/dictionaries/ua/home_page.json'),
    // product_page: () => import('@/dictionaries/ua/product_page.json'),
    // category_page: () => import('@/dictionaries/ua/category_page.json'),
  },
};

export async function getDictionary<P extends PageDictionaryName>(
  locale: Locale,
  names: readonly PageToDictionaryMap[P][],
) {
  const result: Record<string, unknown> = {};

  // Отримуємо поточний об'єкт мови
  const currentLocaleDict = dictionaries[locale];

  await Promise.all(
    names.map(async name => {
      // Кастуємо name до фактичних ключів, які зараз є в об'єкті
      const dictKey = name as unknown as keyof typeof currentLocaleDict;
      const loader = currentLocaleDict[dictKey];

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
