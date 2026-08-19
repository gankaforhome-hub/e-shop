import { type CategorySlug } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { type Media } from '@/shared/types';

export type CategoryTranslation = {
  categoryId: string;
  languageCode: Locale;
  title: string;
  description: string;
};

export type Category = {
  id: string;
  slug: CategorySlug;
  image: Media;
  productsCount?: number;
};
