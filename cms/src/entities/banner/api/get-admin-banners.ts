import { cache } from 'react';

import 'server-only';

import { apiRequest, type ApiRequestResult } from '@/shared/api/api-client';

import { type AdminBanner, type BannerLinkTarget } from '../model/types';

//INFO DAL reads for the banner pages. They return the API result as is: the page decides what
//INFO a 403 or 404 looks like. No caching: editors must see their own changes.

/** Every banner in hero order, hidden and scheduled included. */
export function getAdminBanners(): Promise<ApiRequestResult<AdminBanner[]>> {
  return apiRequest<AdminBanner[]>('/admin/banners');
}

/** One banner; deduplicated per request (the page and its metadata both read it). */
export const getAdminBanner = cache(
  (id: string): Promise<ApiRequestResult<AdminBanner>> =>
    apiRequest<AdminBanner>(`/admin/banners/${encodeURIComponent(id)}`),
);

/** Collections a slide can link to. Throws: the editor can't work without them. */
export async function getBannerLinkTargets(): Promise<BannerLinkTarget[]> {
  const result = await apiRequest<BannerLinkTarget[]>(
    '/admin/banners/link-targets',
  );
  if (!result.ok) {
    throw new Error(
      `GET /admin/banners/link-targets failed with ${result.status}`,
    );
  }
  return result.data;
}
