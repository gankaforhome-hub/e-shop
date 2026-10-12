import { type Locale } from '@/shared/i18n/routing';
import { type EntityMeta, type Media, type SeoFields } from '@/shared/types';

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

export type ProductAttributeKey =
  | 'material'
  | 'dishwasher'
  | 'microwave'
  | 'glaze_type'
  | 'heat_resistance'
  | 'care_instructions';

export type ProductOptionKey =
  'diameter' | 'volume' | 'pieces' | 'height' | 'size' | 'color' | 'glaze';

/* ------------------------------------------------------------------ */
/* Language-agnostic core (what the CMS / database stores)             */
/* ------------------------------------------------------------------ */

export type ProductAttribute = {
  nameKey: ProductAttributeKey;
  valueKey: string;
};

export type ProductOption = {
  nameKey: ProductOptionKey;
  valueKey: string;
};

export type ProductWeight = {
  weight: number;
  weightUnit: ProductWeightUnit;
};

export type ProductPrice = {
  amount: number;
  currency: ProductCurrency;
};

export type ProductBadge = {
  id: ProductBadgeStatus;
  color?: string;
  translations: Record<Locale, string>;
};

export type ProductStock = {
  quantity: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
};

/** Product image/video; extends shared `Media` with a required id and fit. */
export type ProductMedia = Media & {
  id: string;
  objectFit: 'contain' | 'cover';
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStock;
  options: ProductOption[];
  mediaId?: string;
  weight?: ProductWeight;
};

export type Product = EntityMeta & {
  id: string;
  slug: string;
  badges: ProductBadgeStatus[];
  categoryId: string;
  primaryCollectionId: string;
  featuredMediaId: string;
  media: ProductMedia[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  /** Sequence number used by `buildSku` when the CMS generates variant SKUs. */
  skuSequence?: number;
};

/* ------------------------------------------------------------------ */
/* Translation records (one row per product × locale)                  */
/* ------------------------------------------------------------------ */

export type ProductAttributeTranslation = {
  nameKey: string;
  name: string;
  value: string;
};

export type ProductOptionTranslation = {
  nameKey: string; // 'diameter'
  name: string; // 'Діаметр'
  valueKey: string; // '22_cm'
  value: string; // '22 см'
};

export type ProductTranslation = {
  productId: string;
  languageCode: Locale;
  title: string;
  description: string;
  attributes: ProductAttributeTranslation[];
  options?: ProductOptionTranslation[];
  seo?: SeoFields;
};

/* ------------------------------------------------------------------ */
/* Resolved (locale-flattened) read models produced by the DAL         */
/* ------------------------------------------------------------------ */

export type ProductBadgeTranslation = {
  id: ProductBadgeStatus;
  label: string;
  color?: string;
};

export type ProductStockTranslation = {
  quantity: number;
  status: ProductStockStatus;
  label: string;
};

export type ProductWeightTranslation = {
  weight: number;
  weightUnit: ProductWeightUnit;
  label: string;
};

export type ProductVariantTranslation = {
  id: string;
  sku: string;
  price: ProductPrice;
  compareAtPrice?: ProductPrice;
  stock: ProductStockTranslation;
  options: ProductOptionTranslation[];
  mediaId?: string;
  weight?: ProductWeightTranslation;
};

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

/** Product resolved for one locale: core data + flattened translation. */
export type LocalizedProduct = Omit<
  Product,
  'badges' | 'attributes' | 'variants'
> & {
  title: string;
  description: string;
  seo?: SeoFields;
  attributes: ProductAttributeTranslation[];
  category: ProductCategoryRef;
  primaryCollection: ProductCollectionRef;
  badges: ProductBadgeTranslation[];
  variants: ProductVariantTranslation[];
};

/** @deprecated Use `LocalizedProduct`. */
export type TProduct = LocalizedProduct;
