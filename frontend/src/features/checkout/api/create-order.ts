import 'server-only';

import { getOrderTotals } from '../lib/build-order-payload';
import { orderPayloadSchema } from '../model/order-payload.schema';

// Totals are sums of UAH prices; tolerate float noise, not real differences
const MONEY_EPSILON = 0.005;

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | {
      ok: false;
      status: 400 | 502;
      error: 'invalid_payload' | 'totals_mismatch' | 'upstream_failed';
      issues?: { path: string; message: string }[];
    };

/**
 * Validates an untrusted order payload, re-checks its totals, logs it and
 * forwards it to `ORDER_API_URL` when configured. Pure input → result; the
 * route handler only maps the result to HTTP.
 */
export async function createOrder(input: unknown): Promise<CreateOrderResult> {
  const parsed = orderPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: 'invalid_payload',
      issues: parsed.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  const payload = parsed.data;
  const expected = getOrderTotals(payload.items);
  const totalsMatch = (
    ['subtotal', 'deliveryFee', 'grandTotal'] as const
  ).every(key => Math.abs(expected[key] - payload.totals[key]) < MONEY_EPSILON);
  if (!totalsMatch) {
    return { ok: false, status: 400, error: 'totals_mismatch' };
  }

  // eslint-disable-next-line no-console -- order trail until persistence lands
  console.info('[checkout] order received', JSON.stringify(payload, null, 2));

  const endpoint = process.env.ORDER_API_URL;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Order API responded with ${response.status}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console -- server-side error trail
      console.error('[checkout] failed to forward order:', error);
      return { ok: false, status: 502, error: 'upstream_failed' };
    }
  }

  return { ok: true, orderId: payload.orderId };
}
