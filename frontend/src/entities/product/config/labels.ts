import { type Locale } from '@/shared/i18n/routing';

import {
  type ProductStockStatus,
  type ProductWeightUnit,
} from '../model/types';

/** Localized unit labels for variant weight. */
export const WEIGHT_UNITS_TRANSLATIONS: Record<
  ProductWeightUnit,
  Record<Locale, string>
> = {
  g: {
    uk: 'г',
    en: 'g',
  },
  kg: {
    uk: 'кг',
    en: 'kg',
  },
};

/** Localized stock labels; `quantity` is used for low-stock messages. */
export const STOCK_TRANSLATIONS: Record<
  ProductStockStatus,
  Record<Locale, (quantity?: number) => string>
> = {
  in_stock: {
    uk: () => 'В наявності',
    en: () => 'In Stock',
  },
  low_stock: {
    uk: qty =>
      qty ? `Закінчується (лишилося ${qty} шт.)` : 'Мало в наявності',
    en: qty => (qty ? `Low stock (only ${qty} left)` : 'Low stock'),
  },
  out_of_stock: {
    uk: () => 'Немає в наявності',
    en: () => 'Out of Stock',
  },
  pre_order: {
    uk: () => 'Передзамовлення',
    en: () => 'Pre-order',
  },
};
