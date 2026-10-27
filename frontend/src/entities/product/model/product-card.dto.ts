import {
  type LocalizedProductBadge,
  type ProductMedia,
  type ProductPrice,
  type ProductStockTranslation,
} from './types';

/** The SKU a card shows: price, stock and its own lead/hover media. */
export type ProductCardVariant = {
  id: string;
  sku: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStockTranslation;
  media: {
    primary: ProductMedia;
    hover?: ProductMedia;
  };
};

/**
 * Catalog card: one per product colour/glaze (`getAppearanceSlices`) with
 * collection, title, that SKU's media and price. Sizes and other options are
 * chosen on the product page.
 */
export type ProductCardDTO = {
  id: string;
  slug: string;
  title: string;
  badges: LocalizedProductBadge[];
  category: {
    id: string;
    slug: string;
    title: string;
  };
  primaryCollection: {
    id: string;
    slug: string;
    title: string;
  };
  /** The SKU matching active filters, else the main (first purchasable) one. */
  variant: ProductCardVariant;
  /** More than one SKU: the card links to the product page on `variant`. */
  hasVariants: boolean;
  /** Colour/glaze of this card when the product comes in several. */
  variantLabel?: string;
  /** Per-user flag merged in after the cached catalog read. */
  isFavorite: boolean;
};
