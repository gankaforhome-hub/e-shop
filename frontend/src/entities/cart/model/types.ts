import { type ProductPrice } from '@/entities/product';
import { type Locale } from '@/shared/i18n/routing';

/** One line in the cart; keyed by variant (one product can have many lines). */
export type CartLine = {
  /** Line id — equals `variantId` so the same variant merges into one line. */
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  slug: string;
  title: string;
  /** Language of `title`; lines in another language are re-translated. */
  locale?: Locale;
  /** Short variant description, e.g. "22 cm · Forest green". */
  variantLabel?: string;
  price: ProductPrice;
  quantity: number;
  image: string;
};

export type CartTotals = {
  totalQuantity: number;
  totalAmount: ProductPrice;
};
