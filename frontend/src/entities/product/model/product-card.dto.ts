import {
  type ProductAttributeTranslation,
  type ProductBadgeTranslation,
  type ProductMedia,
  type ProductOptionTranslation,
  type ProductPrice,
  type ProductStockTranslation,
  type ProductWeightTranslation,
} from './types';

export interface ProductCardDTO {
  id: string;
  slug: string;
  sku: string;
  title: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStockTranslation;
  weight?: ProductWeightTranslation;
  badges: ProductBadgeTranslation[];
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
  media: {
    primary: ProductMedia;
    hover?: ProductMedia;
  };
  attributes: ProductAttributeTranslation[];
  options: ProductOptionTranslation[];
  isFavorite: boolean;
}
