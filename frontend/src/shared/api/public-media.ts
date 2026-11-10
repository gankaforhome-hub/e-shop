import { z } from 'zod';

import { type Media } from '@/shared/types';

/**
 * Image of a public API response (`PublicMediaResponse`, backend
 * `modules/media/responses/public-media.response.ts`): collection covers, hero banners.
 * Only the fields the storefront reads are listed.
 */
export const publicMediaSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string().nullable(),
  objectPosition: z.string(),
});

export type PublicMediaResponse = z.infer<typeof publicMediaSchema>;

/** API image → `Media` for `AppMedia` (blur placeholder only when generated). */
export const toMedia = ({
  id,
  src,
  alt,
  blurDataUrl,
  width,
  height,
  objectPosition,
}: PublicMediaResponse): Media => ({
  id,
  src,
  alt,
  ...(blurDataUrl && { blurDataURL: blurDataUrl }),
  width,
  height,
  objectPosition,
});
