import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { backendGet } from '@/shared/api/backend';
import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { type HeroBannerDTO, mapHeroBanner } from '../lib/map-collection';
import { collectionListResponseSchema } from '../model/api-types';

/**
 * Home hero slides for `lang` (`GET /collections/banners`): active collections
 * with `inBanner`, in hero order. Empty list when none is flagged.
 */
export async function getHeroBanners(lang: Locale): Promise<HeroBannerDTO[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections);

  const result = await backendGet('collections/banners', {
    searchParams: { lang },
  });
  if (!result.ok) {
    throw new Error(`GET /collections/banners failed with ${result.status}`);
  }

  return collectionListResponseSchema.parse(result.data).flatMap(response => {
    const banner = mapHeroBanner(response);
    if (!banner) {
      // eslint-disable-next-line no-console -- server-side data-quality trail
      console.warn(`[collections] "${response.slug}" has no banner, skipped`);
      return [];
    }
    return [banner];
  });
}
