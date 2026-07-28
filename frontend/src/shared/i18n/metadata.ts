import type HomeMetadata from '@/dictionaries/en/metadata/home.json';
// import CategoryMetadata from '@/dictionaries/en/metadata/category_page.json';
// import ProductMetadata from '@/dictionaries/en/metadata/product_page.json';

import { type Locale } from './locales';
import { type MetadataName } from './types';

// Типи завантажувачів метаданих
type MetadataLoaders = {
  home: () => Promise<{ default: typeof HomeMetadata }>;
  // product_page: () => Promise<{ default: typeof ProductMetadata }>;
  // category_page: () => Promise<{ default: typeof CategoryMetadata }>;
};

export const metadataDictionaries: Record<Locale, MetadataLoaders> = {
  en: {
    home: () => import('@/dictionaries/en/metadata/home.json'),
    // product_page: () => import('@/dictionaries/en/metadata/product_page.json'),
    // category_page: () => import('@/dictionaries/en/metadata/category_page.json'),
  },
  ua: {
    home: () => import('@/dictionaries/ua/metadata/home.json'),
    // product_page: () => import('@/dictionaries/ua/metadata/product_page.json'),
    // category_page: () => import('@/dictionaries/ua/metadata/category_page.json'),
  },
};

/**
 * Asynchronously loads and merges metadata dictionary JSON files for a given locale and page name(s).
 *
 * @template M - A valid metadata page name constraint extending {@link MetadataName}.
 *
 * @param locale - The target language/locale identifier (e.g., `'en'`, `'ua'`).
 * @param names - A single metadata page name or a list of metadata page names to load.
 *
 * @returns A promise that resolves to a merged key-value dictionary object containing the default exports of the metadata files.
 *
 * @example
 * // Single page usage:
 * const homeMetadata = await getMetadata('en', 'home_page');
 *
 * @example
 * // Multiple pages usage:
 * const pageMetadata = await getMetadata('ua', ['home_page', 'product_page']);
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
