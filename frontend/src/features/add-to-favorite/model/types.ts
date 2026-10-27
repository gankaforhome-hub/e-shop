import { type CartLine } from '@/entities/cart';
import { type ProductPrice } from '@/entities/product';

/**
 * A wishlist row. `add`: one SKU, added straight from the list (`cartLine`);
 * `options`: several sizes/colours, chosen on the product page; `soldOut`.
 */
export type FavoriteItem = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: ProductPrice;
  action: 'add' | 'options' | 'soldOut';
  cartLine: Omit<CartLine, 'quantity'> | null;
};
