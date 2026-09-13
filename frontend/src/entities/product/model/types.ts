import { type Locale } from '@/shared/i18n/routing';

export type ProductCurrency = 'UAH' | 'USD' | 'EUR';

export type ProductBadgeStatus =
  | 'new'
  | 'top'
  | 'pre_order'
  | 'bestseller'
  | 'limited'
  | 'most_popular'
  | 'sale';

export type ProductStockStatus =
  'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';

export type ProductWeightUnit = 'g' | 'kg';

export interface ProductAttribute {
  nameKey:
    | 'material'
    | 'dishwasher'
    | 'microwave'
    | 'glaze_type'
    | 'heat_resistance'
    | 'care_instructions';
  valueKey: string;
}

export interface ProductOption {
  nameKey: 'diameter' | 'volume' | 'pieces' | 'height' | 'size';
  valueKey: string;
}

export interface ProductWeight {
  weight: number;
  weightUnit: ProductWeightUnit;
}

export type ProductPrice = {
  amount: number;
  currency: ProductCurrency;
};

export interface ProductBadge {
  id: ProductBadgeStatus;
  color?: string;
  translations: Record<Locale, string>;
}
export interface ProductStock {
  quantity: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
}

export type ProductCategoryRef = {
  id: string;
  slug: string;
  title: string;
};

export type ProductCollectionRef = {
  id: string;
  slug: string;
  title: string;
};

export interface ProductMedia {
  id: string;
  src: string;
  objectFit: 'contain' | 'cover';
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStock;
  options: ProductOption[];
  mediaId?: string;
  weight?: ProductWeight;
}

export interface Product {
  id: string;
  slug: string;
  badges: ProductBadgeStatus[];
  categoryId: string;
  primaryCollectionId: string;
  featuredMediaId: string;
  media: ProductMedia[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  isFavorite: boolean;
}

export interface ProductBadgeTranslation {
  id: ProductBadgeStatus;
  label: string;
  color?: string;
}

export interface ProductStockTranslation {
  quantity: number;
  status: ProductStockStatus;
  label: string;
}

export interface ProductAttributeTranslation {
  nameKey: string;
  name: string;
  value: string;
}

export interface ProductOptionTranslation {
  nameKey: string; // 'diameter'
  name: string; // 'Діаметр'
  valueKey: string; // '22_cm'
  value: string; // '22 см'
}

export interface ProductWeightTranslation {
  weight: number;
  weightUnit: ProductWeightUnit;
  label: string;
}

export interface ProductVariantTranslation {
  id: string;
  sku: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStockTranslation;
  options: ProductOptionTranslation[];
  mediaId?: string;
  weight?: ProductWeightTranslation;
}
export interface ProductTranslation {
  productId: string;
  languageCode: Locale;
  title: string;
  description: string;
  attributes: ProductAttributeTranslation[];
  options?: ProductOptionTranslation[];
}
