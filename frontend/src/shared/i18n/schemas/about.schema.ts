import { z } from 'zod';

import type { RawDictionarySchemas } from '@/shared/i18n/types';
import type { Media } from '@/shared/types/media';

export const mediaSchema = z
  .object({
    src: z.string().min(1, 'Media src is required'),
    alt: z.string().optional(),
  })
  .passthrough() as z.ZodType<Media>;

export const imagePositionSchema = z.enum(['left', 'right']);

export const panelSchema = z.object({
  image: mediaSchema,
  imagePosition: imagePositionSchema,
  paragraphs: z.string(),
});

export const aboutDictionarySchema = z
  .object({
    aboutHero: z.object({ panel: panelSchema }).passthrough(),
    artistGallery: z.object({ images: z.array(mediaSchema) }).passthrough(),
    artOfLiving: z.object({ panel: panelSchema }).passthrough(),
  })
  .passthrough();

export function parseAboutDictionary(rawAbout: RawDictionarySchemas['about']) {
  return aboutDictionarySchema.parse(rawAbout) as typeof rawAbout &
    z.infer<typeof aboutDictionarySchema>;
}
