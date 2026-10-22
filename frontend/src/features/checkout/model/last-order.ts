'use client';

import { useMemo, useSyncExternalStore } from 'react';

import { z } from 'zod';

import {
  deliveryMethods,
  type OrderPayload,
  paymentMethods,
} from '@/entities/order';

const STORAGE_KEY = 'ganka-last-order';

/** The slice of `OrderPayload` the confirmation screen renders. */
const lastOrderSchema = z.object({
  orderId: z.string(),
  delivery: z.object({
    method: z.enum(deliveryMethods),
    city: z.string(),
    branchOrAddress: z.string(),
    country: z.string().optional(),
  }),
  payment: z.object({ method: z.enum(paymentMethods) }),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      variant: z.string().optional(),
      image: z.string(),
      price: z.number(),
      quantity: z.number(),
    }),
  ),
  totals: z.object({ grandTotal: z.number() }),
});

export type LastOrder = z.infer<typeof lastOrderSchema>;

/**
 * Keeps the placed order for the confirmation page (per tab). Storage can be
 * unavailable (private mode, blocked site data); the page then shows the
 * order id from the URL only.
 */
export function saveLastOrder(order: OrderPayload) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Non-critical: details are a convenience, the order is already placed
  }
}

const readLastOrder = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};

/** Stored order details, only when they belong to `orderId` from the URL. */
export function useLastOrder(orderId?: string): LastOrder | null {
  const raw = useSyncExternalStore(subscribe, readLastOrder, () => null);

  return useMemo(() => {
    if (!raw || !orderId) {
      return null;
    }
    try {
      const parsed = lastOrderSchema.safeParse(JSON.parse(raw));
      return parsed.success && parsed.data.orderId === orderId
        ? parsed.data
        : null;
    } catch {
      return null;
    }
  }, [raw, orderId]);
}
