import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';
import { compareSortOrder } from '@/shared/lib/utils';

import { mockSeasons, mockSeasonTranslations } from '../mock/seasons';
import { type SeasonDTO } from '../model/season';

/**
 * Every season resolved for `lang` (requested → default locale → slug), in
 * `sortOrder`. Mirrors `seasons` joined with `season_translations`.
 */
export async function getSeasons(lang: Locale): Promise<SeasonDTO[]> {
  'use cache';
  cacheLife('days');
  cacheTag(cacheTags.seasons);

  const translationsBySlug = groupTranslationsBy(
    mockSeasonTranslations,
    row => row.seasonSlug,
  );

  return mockSeasons
    .map(season => ({
      ...season,
      label:
        pickTranslation(translationsBySlug.get(season.slug) ?? [], lang)
          ?.label ?? season.slug,
    }))
    .toSorted(compareSortOrder);
}
