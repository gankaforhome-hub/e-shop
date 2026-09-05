import { type Locale } from '@/shared/i18n/routing';

import { mockCategories, mockCategoriesTranslations } from '../mock/categories';
import { type CategoryDTO } from '../model/category.dto';

export const getCategories = async (
  lang: Locale = 'en',
): Promise<CategoryDTO[]> => {
  return mockCategories.map(category => {
    const translation =
      mockCategoriesTranslations.find(
        t => t.categoryId === category.id && t.languageCode === lang,
      ) ||
      mockCategoriesTranslations.find(
        t => t.categoryId === category.id && t.languageCode === 'en',
      );
    return {
      ...category,
      title: translation?.title ?? '',
      description: translation?.description ?? '',
    };
  });
};

export const getCategoriesBySlug = async (
  slug: string,
  lang: Locale = 'uk',
): Promise<CategoryDTO | undefined> => {
  const categories = await getCategories(lang);
  return categories.find(category => category.slug === slug);
};
