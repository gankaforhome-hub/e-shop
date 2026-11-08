import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { backendGet } from '@/shared/api/backend';
import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { mapSeason } from '../lib/map-collection';
import { seasonListResponseSchema } from '../model/api-types';
import { type SeasonDTO } from '../model/season';

/**
 * Every season resolved for `lang` (requested → `uk` → slug), in
 * `sortOrder` (`GET /collections/seasons`).
 */
export async function getSeasons(lang: Locale): Promise<SeasonDTO[]> {
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
