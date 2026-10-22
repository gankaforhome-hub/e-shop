import { type OrderPayload } from '@/entities/order';
import { apiRoutes } from '@/shared/config/routes';

const SUCCESS_STATUSES = new Set([200, 201]);

/** POSTs the order; resolves `false` on network errors or non-2xx responses. */
export async function submitOrder(payload: OrderPayload): Promise<boolean> {
  try {
    const response = await fetch(apiRoutes.checkout, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return SUCCESS_STATUSES.has(response.status);
  } catch {
    return false;
  }
}
