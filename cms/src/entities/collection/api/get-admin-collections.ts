import { cache } from 'react';

import 'server-only';

import { apiRequest, type ApiRequestResult } from '@/shared/api/api-client';

import {
  type AdminCollection,
  type AdminSeason,
  type Season,
} from '../model/types';

//INFO DAL reads for the collection pages. They return the API result as is: the page decides
//INFO what a 403 (no access) or 404 (unknown id) looks like. No caching: the editor must see
//INFO its own changes, and the requests carry the staff member's token.

/** Every collection, inactive included, in `sortOrder`. */
export function getAdminCollections(): Promise<
  ApiRequestResult<AdminCollection[]>
> {
  return apiRequest<AdminCollection[]>('/admin/collections');
}

/**
 * One collection with every translation. A malformed id answers 400, an unknown one 404.
 * Deduplicated per request: the page and its metadata both read it.
 */
export const getAdminCollection = cache(
  (id: string): Promise<ApiRequestResult<AdminCollection>> =>
    apiRequest<AdminCollection>(`/admin/collections/${encodeURIComponent(id)}`),
);

/**
 * Seasons for the editor's select, labels in `lang` (public endpoint). Throws instead of
 * returning an empty list: a select without the collection's season would clear it on save.
 */
export async function getSeasons(lang: string): Promise<Season[]> {
  const result = await apiRequest<Season[]>(
    `/collections/seasons?lang=${encodeURIComponent(lang)}`,
  );
  if (!result.ok) {
    throw new Error(`GET /collections/seasons failed with ${result.status}`);
  }

  return result.data;
}

/** Every season with labels in every language and its usage (catalog managers). */
export function getAdminSeasons(): Promise<ApiRequestResult<AdminSeason[]>> {
  return apiRequest<AdminSeason[]>('/admin/seasons');
}
