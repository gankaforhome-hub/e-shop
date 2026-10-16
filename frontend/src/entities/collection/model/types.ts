import { type Locale } from '@/shared/i18n/routing';
import { type EntityMeta, type Media, type SeoFields } from '@/shared/types';

import { type SeasonSlug } from './season';

/** Language-agnostic collection core. */
export type Collection = EntityMeta & {
  id: string;
  slug: string;
  media: Media;
  /** Short uppercase code used as the collection segment of generated SKUs. */
  skuPrefix?: string;
  /** Optional season slug (`seasons.slug`), inherited by the collection's products. */
  season?: SeasonSlug;
};

/** Translation row (one per collection × locale). */
export type CollectionTranslation = {
  collectionId: string;
  languageCode: Locale;
  title: string;
  shortDescription: string;
  description: string;
};

/** M:N relation between collections and categories. */
export type CollectionCategory = {
  collectionId: string;
  categoryId: string;
};

/** Localized SEO row. */
export type CollectionSeo = SeoFields & {
  collectionId: string;
  languageCode: Locale;
};

/** Collection resolved for one locale. */
export type CollectionDTO = Collection & {
  title: string;
  shortDescription: string;
  description: string;
  categoryIds: string[];
  seo: SeoFields;
};
