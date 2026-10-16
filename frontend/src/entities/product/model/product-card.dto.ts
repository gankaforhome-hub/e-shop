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

/** Minimal catalog card: collection, title, price; options live on the product page. */
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
  /** Per-user flag merged in after the cached catalog read. */
  isFavorite: boolean;
};
