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

/** Collection resolved for one locale (`GET /collections?lang=`). */
export type CollectionDTO = Collection & {
  title: string;
  shortDescription: string;
  description: string;
  seo: SeoFields;
};
