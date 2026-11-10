import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { backendGet } from '@/shared/api/backend';
import { failOnBuild, logBackendFallback } from '@/shared/api/backend-fallback';
import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { mapCollection } from '../lib/map-collection';
import {
  collectionListResponseSchema,
  collectionResponseSchema,
} from '../model/api-types';
import { type CollectionDTO } from '../model/types';

/**
 * Active collections flattened for `lang` (the API falls back to `uk`), in
 * CMS `sortOrder`. Collections without a cover are skipped with a warning.
 * Strict: API failures throw (a stale entry keeps being served meanwhile).
 * For build-time lists (`generateStaticParams`); pages use `getCollections`.
 */
export async function loadCollections(lang: Locale): Promise<CollectionDTO[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections);

  const result = await backendGet('collections', { searchParams: { lang } });
  if (!result.ok) {
    throw new Error(`GET /collections failed with ${result.status}`);
  }

  return collectionListResponseSchema.parse(result.data).flatMap(response => {
    const collection = mapCollection(response);
    if (!collection) {
      // eslint-disable-next-line no-console -- server-side data-quality trail
      console.warn(`[collections] "${response.slug}" has no cover, skipped`);
      return [];
    }
    return [collection];
  });
}

/**
 * `loadCollections` that never fails the page: with the API down it returns
 * `[]` (menus and lists show their empty state) and retries within a minute.
 */
export async function getCollections(lang: Locale): Promise<CollectionDTO[]> {
  'use cache';
  cacheTag(cacheTags.collections);

  try {
    const collections = await loadCollections(lang);
    cacheLife('hours');
    return collections;
  } catch (error) {
    failOnBuild(error);
    logBackendFallback('collections', error);
    cacheLife('minutes');
    return [];
  }
}

/**
 * One active collection, or `null` when unknown, inactive or without a cover.
 * API failures throw: the page shows the 500 page (a 404 would deindex it).
 */
export async function getCollectionBySlug(
  slug: string,
  lang: Locale,
): Promise<CollectionDTO | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections, cacheTags.collection(slug));

  const result = await backendGet(`collections/${encodeURIComponent(slug)}`, {
    searchParams: { lang },
  });
  if (!result.ok) {
    if (result.status === 404) {
      return null;
    }
    throw new Error(`GET /collections/${slug} failed with ${result.status}`);
  }

  return mapCollection(collectionResponseSchema.parse(result.data));
}
