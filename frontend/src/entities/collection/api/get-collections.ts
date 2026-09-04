import { type Locale } from '@/shared/i18n/routing';

import {
  mockCollectionCategories,
  mockCollections,
  mockCollectionSeo,
  mockCollectionTranslations,
} from '../mock/collections';
import { type Collection } from '../model/types';

export interface CollectionDTO extends Collection {
  title: string;
  shortDescription: string;
  description: string;
  categoryIds: string[];
  seo: {
    title: string;
    description: string;
  };
}

export const getCollections = async (
  lang: Locale = 'en',
): Promise<CollectionDTO[]> => {
  // await new Promise(resolve => setTimeout(resolve, 1000));

  return mockCollections.map(collection => {
    // 1. Translation search
    const translation =
      mockCollectionTranslations.find(
        t => t.collectionId === collection.id && t.languageCode === lang,
      ) ||
      mockCollectionTranslations.find(
        t => t.collectionId === collection.id && t.languageCode === 'en',
      );

    // 2. Search SEOO
    const seo =
      mockCollectionSeo.find(
        s => s.collectionId === collection.id && s.languageCode === lang,
      ) ||
      mockCollectionSeo.find(
        s => s.collectionId === collection.id && s.languageCode === 'en',
      );

    // 3. A collection of related categories
    const categoryIds = mockCollectionCategories
      .filter(cc => cc.collectionId === collection.id)
      .map(cc => cc.categoryId);

    return {
      ...collection,
      title: translation?.title || '',
      shortDescription: translation?.shortDescription || '',
      description: translation?.description || '',
      categoryIds,
      seo: {
        title: seo?.title || '',
        description: seo?.description || '',
      },
    };
  });
};
