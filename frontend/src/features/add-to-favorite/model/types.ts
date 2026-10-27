import { type CartLine } from '@/entities/cart';
import { type ProductPrice } from '@/entities/product';

/**
 * A wishlist row. `add`: one SKU in the shown colour, added straight from
 * the list (`cartLine`), also for colour-only products; `options`: sizes or
 * other choices inside that colour, made on the product page; `soldOut`.
 */
export type FavoriteItem = {
  productId: string;
  slug: string;
  /** SKU the row shows; links open the PDP on it (`?variant=`). */
  variantSku?: string;
  title: string;
  image: string;
  price: ProductPrice;
  action: 'add' | 'options' | 'soldOut';
  cartLine: Omit<CartLine, 'quantity'> | null;
};
