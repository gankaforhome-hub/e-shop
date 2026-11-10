'use server';

import { apiRequest } from '@/shared/api/api-client';

export type BannerOrderErrorKey =
  'stale' | 'forbidden' | 'tooManyRequests' | 'serverError';

export type BannerOrderResult =
  { ok: true } | { ok: false; error: BannerOrderErrorKey };

/**
 * Saves the hero order: every banner id in the new order (`sortOrder` = 1-based position).
 * A 400 means the list changed meanwhile (a banner was added or deleted).
 */
export async function saveBannerOrderAction(
  ids: string[],
): Promise<BannerOrderResult> {
  const result = await apiRequest<void>('/admin/banners/order', {
    method: 'PATCH',
    json: { ids },
  });
  if (result.ok) {
    return { ok: true };
  }

  const byStatus: Partial<Record<number, BannerOrderErrorKey>> = {
    400: 'stale',
    401: 'forbidden',
    403: 'forbidden',
    429: 'tooManyRequests',
  };
  return { ok: false, error: byStatus[result.status] ?? 'serverError' };
}
