import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';
import { compareSortOrder } from '@/shared/lib/utils';

import {
  mockCollectionCategories,
  mockCollections,
  mockCollectionSeo,
  mockCollectionTranslations,
} from '../mock/collections';
import { type CollectionDTO } from '../model/types';

/**
 * Returns all collections flattened for `lang` (falls back to the default
 * locale), in CMS `sortOrder`. `categoryIds` resolves the M:N
 * `collection_categories` join.
 */
export async function getCollections(lang: Locale): Promise<CollectionDTO[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections);

  const translationsById = groupTranslationsBy(
    mockCollectionTranslations,
    t => t.collectionId,
  );
  const seoById = groupTranslationsBy(mockCollectionSeo, s => s.collectionId);
  // Join rows grouped once instead of scanned per collection
  const categoriesById = groupTranslationsBy(
    mockCollectionCategories,
    cc => cc.collectionId,
  );

  return mockCollections.toSorted(compareSortOrder).map(collection => {
    const translation = pickTranslation(
      translationsById.get(collection.id) ?? [],
      lang,
    );
    const seo = pickTranslation(seoById.get(collection.id) ?? [], lang);
    return {
      ...collection,
      title: translation?.title ?? '',
      shortDescription: translation?.shortDescription ?? '',
      description: translation?.description ?? '',
      categoryIds: (categoriesById.get(collection.id) ?? []).map(
        cc => cc.categoryId,
      ),
      seo: {
        title: seo?.title ?? '',
        description: seo?.description ?? '',
      },
    };
  });
}

export async function getCollectionBySlug(
  slug: string,
  lang: Locale,
): Promise<CollectionDTO | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections, cacheTags.collection(slug));

  const collections = await getCollections(lang);
  return collections.find(collection => collection.slug === slug) ?? null;
}
