import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { backendGet } from '@/shared/api/backend';
import { failOnBuild, logBackendFallback } from '@/shared/api/backend-fallback';
import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { mapSeason } from '../lib/map-collection';
import { seasonListResponseSchema } from '../model/api-types';
import { type SeasonDTO } from '../model/season';

/**
 * Every season resolved for `lang` (requested → `uk` → slug), in
 * `sortOrder` (`GET /collections/seasons`). Strict: API failures throw.
 */
async function loadSeasons(lang: Locale): Promise<SeasonDTO[]> {
  'use cache';
  cacheLife('days');
  cacheTag(cacheTags.seasons);

  const result = await backendGet('collections/seasons', {
    searchParams: { lang },
  });
  if (!result.ok) {
    throw new Error(`GET /collections/seasons failed with ${result.status}`);
  }

  return seasonListResponseSchema.parse(result.data).map(mapSeason);
}

/**
 * `loadSeasons` that never fails the page: with the API down it returns `[]`
 * (no season filter group) and retries within a minute.
 */
export async function getSeasons(lang: Locale): Promise<SeasonDTO[]> {
  'use cache';
  cacheTag(cacheTags.seasons);

  try {
    const seasons = await loadSeasons(lang);
    cacheLife('days');
    return seasons;
  } catch (error) {
    failOnBuild(error);
    logBackendFallback('seasons', error);
    cacheLife('minutes');
    return [];
  }
}
