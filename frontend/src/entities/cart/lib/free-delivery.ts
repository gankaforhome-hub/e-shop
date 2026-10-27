import { type ProductPrice } from '@/entities/product';

/** Orders from this subtotal ship free (see the "Payment and delivery" page). */
export const FREE_DELIVERY_THRESHOLD: ProductPrice = {
  amount: 5000,
  currency: 'UAH',
};

export type FreeDeliveryProgress = {
  /** Amount still missing; zero once the threshold is reached. */
  remaining: ProductPrice;
  /** Share of the threshold covered, clamped to 0…1. */
  ratio: number;
  reached: boolean;
};

/** Pure progress towards free delivery for a cart subtotal. */
export function getFreeDeliveryProgress(
  subtotal: ProductPrice,
  threshold: ProductPrice = FREE_DELIVERY_THRESHOLD,
): FreeDeliveryProgress {
  const missing = Math.max(threshold.amount - subtotal.amount, 0);

  return {
    remaining: { amount: missing, currency: threshold.currency },
    ratio: Math.min(subtotal.amount / threshold.amount, 1),
    reached: missing === 0,
  };
}
