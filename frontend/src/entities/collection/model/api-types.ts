import { z } from 'zod';

/*
 * Response shapes of the public collection API (`GET /collections`,
 * `/collections/:slug`, `/collections/seasons`, `/collections/banners`).
 * Mirrors backend `modules/collection/responses/*.response.ts`; only the
 * fields the storefront reads are listed (unknown keys are dropped).
 */

/** `CollectionMediaResponse` */
const collectionMediaResponseSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string().nullable(),
  objectPosition: z.string(),
});

/** `CollectionSeasonResponse` */
const collectionSeasonResponseSchema = z.object({
  slug: z.string(),
  label: z.string(),
});

/** `CollectionResponse` */
export const collectionResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  sortOrder: z.number(),
  skuPrefix: z.string().nullable(),
  season: collectionSeasonResponseSchema.nullable(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  seo: z.object({ title: z.string(), description: z.string() }),
  media: collectionMediaResponseSchema.nullable(),
  banner: collectionMediaResponseSchema.nullable(),
  inBanner: z.boolean(),
  bannerSubtitle: z.string().nullable(),
});

export const collectionListResponseSchema = z.array(collectionResponseSchema);

/** `SeasonResponse` */
export const seasonListResponseSchema = z.array(
  collectionSeasonResponseSchema.extend({ sortOrder: z.number() }),
);

export type CollectionMediaResponse = z.infer<
  typeof collectionMediaResponseSchema
>;
export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type SeasonResponse = z.infer<typeof seasonListResponseSchema>[number];
