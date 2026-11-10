import { z } from 'zod';

import { publicMediaSchema } from '@/shared/api/public-media';

/*
 * Response shapes of the public collection API (`GET /collections`,
 * `/collections/:slug`, `/collections/seasons`).
 * Mirrors backend `modules/collection/responses/*.response.ts`; only the
 * fields the storefront reads are listed (unknown keys are dropped).
 */

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
  media: publicMediaSchema.nullable(),
});

export const collectionListResponseSchema = z.array(collectionResponseSchema);

/** `SeasonResponse` */
export const seasonListResponseSchema = z.array(
  collectionSeasonResponseSchema.extend({ sortOrder: z.number() }),
);

export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type SeasonResponse = z.infer<typeof seasonListResponseSchema>[number];
