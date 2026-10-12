import { type CategorySlug } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { type EntityMeta, type Media, type SeoFields } from '@/shared/types';

export type CategoryTranslation = {
  categoryId: string;
  languageCode: Locale;
  title: string;
  description: string;
  seo?: SeoFields;
};

export type Category = EntityMeta & {
  id: string;
  slug: CategorySlug;
  image: Media;
  productsCount?: number;
  /** Short uppercase code used as the category segment of generated SKUs. */
  skuPrefix?: string;
};
