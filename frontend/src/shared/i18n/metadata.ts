import type HomeMetadata from '@/dictionaries/en/metadata/home_page.json';
// import CategoryMetadata from '@/dictionaries/en/metadata/category_page.json';
// import ProductMetadata from '@/dictionaries/en/metadata/product_page.json';

import { type Locale } from './locales';
import { type PageDictionaryName } from './types';

export type MetadataName = PageDictionaryName;

// Типи завантажувачів метаданих
type MetadataLoaders = {
  home_page: () => Promise<{ default: typeof HomeMetadata }>;
  // product_page: () => Promise<{ default: typeof ProductMetadata }>;
  // category_page: () => Promise<{ default: typeof CategoryMetadata }>;
};

export const metadataDictionaries: Record<Locale, MetadataLoaders> = {
  en: {
    home_page: () => import('@/dictionaries/en/metadata/home_page.json'),
    // product_page: () => import('@/dictionaries/en/metadata/product_page.json'),
    // category_page: () => import('@/dictionaries/en/metadata/category_page.json'),
  },
  ua: {
    home_page: () => import('@/dictionaries/ua/metadata/home_page.json'),
    // product_page: () => import('@/dictionaries/ua/metadata/product_page.json'),
    // category_page: () => import('@/dictionaries/ua/metadata/category_page.json'),
  },
};

/**
 * Отримання метаданих для сторінки або списку сторінок
 */
export async function getMetadata<M extends MetadataName>(
  locale: Locale,
  names: M | readonly M[],
) {
  const result: Record<string, unknown> = {};

  // Приводимо до масиву, якщо передано один рядок
  const nameList = Array.isArray(names) ? names : [names];
  const currentLocaleDict = metadataDictionaries[locale];

  await Promise.all(
    nameList.map(async name => {
      const dictKey = name as keyof typeof currentLocaleDict;
      const loader = currentLocaleDict[dictKey];

      if (typeof loader === 'function') {
        const dictionary = await loader();
        Object.assign(result, dictionary.default);
      }
    }),
  );

  return result;
}
