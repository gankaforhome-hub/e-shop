import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { backendGet } from '@/shared/api/backend';
import { failOnBuild, logBackendFallback } from '@/shared/api/backend-fallback';
import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { type HeroBannerDTO, mapHeroBanner } from '../lib/map-banner';
import { bannerListResponseSchema } from '../model/api-types';

/**
 * Home hero slides for `lang` (`GET /banners`): switched on, inside their dates, in hero
 * order. Cached for minutes, not hours, so a slide's start / end date takes effect soon
 * even without a revalidation webhook. Strict: API failures throw.
 */
async function loadHeroBanners(lang: Locale): Promise<HeroBannerDTO[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(cacheTags.banners);

  const result = await backendGet('banners', { searchParams: { lang } });
  if (!result.ok) {
    throw new Error(`GET /banners failed with ${result.status}`);
  }

  return bannerListResponseSchema.parse(result.data).flatMap(response => {
    const banner = mapHeroBanner(response);
    if (!banner) {
      // eslint-disable-next-line no-console -- server-side data-quality trail
      console.warn(`[banners] "${response.id}" has an unusable link, skipped`);
      return [];
    }
    return [banner];
  });
}

/**
 * `loadHeroBanners` that never fails the page: with the API down it returns `[]`
 * (the hero shows its fallback slide) and retries within a minute.
 */
export async function getHeroBanners(lang: Locale): Promise<HeroBannerDTO[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(cacheTags.banners);

  try {
    return await loadHeroBanners(lang);
  } catch (error) {
    failOnBuild(error);
    logBackendFallback('banners', error);
    return [];
  }
}
