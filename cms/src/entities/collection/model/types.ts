import { type Media } from '@/entities/media';

/*
 * Responses of `/admin/collections`, written by hand from Swagger
 * (backend `modules/collection/responses/admin-collection.response.ts`).
 */

export type CollectionLocale = 'uk' | 'en';

/** `AdminCollectionTranslationResponse` */
export type AdminCollectionTranslation = {
  languageCode: CollectionLocale;
  title: string;
  shortDescription: string;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

/** `AdminCollectionResponse`: inactive collections included, texts in every language. */
export type AdminCollection = {
  id: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  /** Two digits in creation order (01, 02, …), assigned by the API and never changed */
  skuPrefix: string;
  seasonSlug: string | null;
  /** Card image */
  coverImage: Media | null;
  /** Home hero banners that link here; the collection can be deleted only at 0 */
  bannerCount: number;
  /** uk first */
  translations: AdminCollectionTranslation[];
  createdAt: string;
  updatedAt: string;
};

/** `SeasonResponse` of the public `GET /collections/seasons`: label in the requested language. */
export type Season = {
  slug: string;
  label: string;
  sortOrder: number;
};

/** `AdminSeasonTranslationResponse` */
export type AdminSeasonTranslation = {
  languageCode: CollectionLocale;
  label: string;
};

/** `AdminSeasonResponse` of `/admin/seasons` (backend `responses/admin-season.response.ts`). */
export type AdminSeason = {
  /** Catalog filter value; never changes */
  slug: string;
  sortOrder: number;
  /** uk first */
  translations: AdminSeasonTranslation[];
  /** Collections in the season; only an unused one can be deleted */
  collectionCount: number;
  createdAt: string;
  updatedAt: string;
};
