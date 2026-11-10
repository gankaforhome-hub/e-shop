import { z } from 'zod';

import { type AdminSeason } from '@/entities/collection';

//INFO Mirrors backend `CreateSeasonDto`: slug of lowercase Latin words joined by - or _
//INFO (the seed has `new_year`), ≤ 50; uk label required, labels ≤ 50. Messages are keys
//INFO of `seasons.errors`.

export type SeasonErrorKey =
  | 'required'
  | 'tooLong'
  | 'invalidSlug'
  | 'invalidNumber'
  | 'slugTaken'
  | 'inUse'
  | 'forbidden'
  | 'notFound'
  | 'tooManyRequests'
  | 'serverError';

const SEASON_SLUG_PATTERN = /^[a-z0-9]+([_-][a-z0-9]+)*$/;

export const seasonFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'required')
    .max(50, 'tooLong')
    .regex(SEASON_SLUG_PATTERN, 'invalidSlug'),
  sortOrder: z
    .number({ invalid_type_error: 'invalidNumber' })
    .int('invalidNumber')
    .min(0, 'invalidNumber'),
  labels: z.object({
    uk: z.string().trim().min(1, 'required').max(50, 'tooLong'),
    /** `''` = no English label (the storefront then shows the uk one) */
    en: z.string().trim().max(50, 'tooLong'),
  }),
});

export type SeasonFormInput = z.input<typeof seasonFormSchema>;
export type SeasonFormValues = z.output<typeof seasonFormSchema>;

/** Form values of an existing season, or of a new one placed after `nextSortOrder - 1`. */
export function toSeasonFormValues(
  season?: AdminSeason,
  nextSortOrder = 0,
): SeasonFormInput {
  const label = (locale: 'uk' | 'en') =>
    season?.translations.find(item => item.languageCode === locale)?.label ??
    '';

  return {
    slug: season?.slug ?? '',
    sortOrder: season?.sortOrder ?? nextSortOrder,
    labels: { uk: label('uk'), en: label('en') },
  };
}
