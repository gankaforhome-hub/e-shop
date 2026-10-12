import { type ProductPrice } from '@/entities/product';

import { type CartLine, type CartTotals } from '../model/types';

/** Pure totals calculation; assumes a single-currency cart (falls back to UAH). */
export function getCartTotals(lines: readonly CartLine[]): CartTotals {
  const currency: ProductPrice['currency'] = lines[0]?.price.currency ?? 'UAH';

  return lines.reduce<CartTotals>(
    (acc, line) => ({
      totalQuantity: acc.totalQuantity + line.quantity,
      totalAmount: {
        currency,
        amount: acc.totalAmount.amount + line.price.amount * line.quantity,
      },
    }),
    { totalQuantity: 0, totalAmount: { amount: 0, currency } },
  );
}
