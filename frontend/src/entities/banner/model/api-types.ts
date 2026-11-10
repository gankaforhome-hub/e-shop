import { z } from 'zod';

import { publicMediaSchema } from '@/shared/api/public-media';

/*
 * `GET /banners` (backend `modules/banner/responses/banner.response.ts`): the home hero
 * slides, already filtered (switched on, inside their dates) and ordered.
 */

/** `BannerResponse` */
export const bannerResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  ctaLabel: z.string().nullable(),
  link: z.object({
    type: z.enum(['collection', 'url']),
    collectionSlug: z.string().nullable(),
    url: z.string().nullable(),
  }),
  image: publicMediaSchema,
});

export const bannerListResponseSchema = z.array(bannerResponseSchema);

export type BannerResponse = z.infer<typeof bannerResponseSchema>;
