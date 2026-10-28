import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { getCollections } from './get-collections';
import { type CollectionDTO } from '../model/types';

/** Collections per page on `/collections` (`?page=N`). */
export const COLLECTIONS_PAGE_SIZE = 12;

export type GetCollectionsPageParams = {
  lang: Locale;
  /** 1-based; out-of-range values are clamped. */
  page?: number;
  limit?: number;
};

export type PaginatedCollectionsDTO = {
  data: CollectionDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

/** One page of all collections, in CMS `sortOrder`. */
export async function getCollectionsPage({
  lang,
  page: requestedPage = 1,
  limit: requestedLimit = COLLECTIONS_PAGE_SIZE,
}: GetCollectionsPageParams): Promise<PaginatedCollectionsDTO> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.collections);

  const collections = await getCollections(lang);

  const total = collections.length;
  const limit = Math.max(1, requestedLimit);
  const totalPages = Math.ceil(total / limit) || 1;
  // Out-of-range pages (stale links, `?page=99`) show the last page
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const offset = (page - 1) * limit;

  return {
    data: collections.slice(offset, offset + limit),
    meta: { total, page, limit, totalPages },
  };
}
