'use server';

import { apiRequest } from '@/shared/api/api-client';

export type OrderErrorKey =
  'stale' | 'forbidden' | 'tooManyRequests' | 'serverError';

export type OrderActionResult =
  { ok: true } | { ok: false; error: OrderErrorKey };

/**
 * Saves the order of every collection (`sortOrder` = 1-based position). The API refuses a
 * list that misses or adds a collection, which means someone changed the list meanwhile.
 */
export async function saveCollectionOrderAction(
  ids: string[],
): Promise<OrderActionResult> {
  const result = await apiRequest<void>('/admin/collections/order', {
    method: 'PATCH',
    json: { ids },
  });
  if (result.ok) {
    return { ok: true };
  }

  const byStatus: Partial<Record<number, OrderErrorKey>> = {
    400: 'stale',
    401: 'forbidden',
    403: 'forbidden',
    429: 'tooManyRequests',
  };
  return { ok: false, error: byStatus[result.status] ?? 'serverError' };
}
