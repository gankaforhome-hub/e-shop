import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';
import { compareSortOrder } from '@/shared/lib/utils';

import { mockCategories, mockCategoriesTranslations } from '../mock/categories';
import { type CategoryDTO } from '../model/category.dto';

/** Returns all categories flattened for `lang` (falls back to the default locale), in CMS `sortOrder`. */
export async function getCategories(lang: Locale): Promise<CategoryDTO[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.categories);

  const translationsById = groupTranslationsBy(
    mockCategoriesTranslations,
    t => t.categoryId,
  );

  return mockCategories.toSorted(compareSortOrder).map(category => {
    const translation = pickTranslation(
      translationsById.get(category.id) ?? [],
      lang,
    );
    return {
      ...category,
      title: translation?.title ?? '',
      description: translation?.description ?? '',
    };
  });
}
