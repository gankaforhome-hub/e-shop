import { type SeasonSlug } from '@/entities/collection/seasons';
import { type Locale } from '@/shared/i18n/routing';
import { type EntityMeta, type Media, type SeoFields } from '@/shared/types';

import {
  type ProductBaseAttributes,
  type VariantAttributes,
} from './attributes';

export type ProductCurrency = 'UAH' | 'USD' | 'EUR';

export type ProductBadgeStatus =
  'new' | 'pre_order' | 'bestseller' | 'limited' | 'most_popular' | 'sale';

export type ProductStockStatus =
  'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';

export type ProductWeightUnit = 'g' | 'kg';

/** Appearance axes without a typed attribute (sizes/volumes are attributes). */
export type ProductOptionKey = 'color' | 'glaze';

/* ------------------------------------------------------------------ */
/* Language-agnostic core (what the CMS / database stores)             */
/* ------------------------------------------------------------------ */

export type ProductOption = {
  nameKey: ProductOptionKey;
  valueKey: string;
  /** Swatch colour (CSS hex) of a colour/glaze value; language-agnostic. */
  swatch?: string;
};

export type ProductWeight = {
  weight: number;
  weightUnit: ProductWeightUnit;
};

export type ProductPrice = {
  amount: number;
  currency: ProductCurrency;
};

/** Badge core (future `badges` table); labels live in `ProductBadgeTranslation`. */
export type ProductBadge = {
  id: ProductBadgeStatus;
  color?: string;
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
  /** Price/size determinants (diameter, volume, burn time, scent…). */
  attributes: VariantAttributes;
  /** Appearance axes (colour, glaze); size-like axes come from `attributes`. */
  options?: ProductOption[];
  /** Variant gallery, ordered (first = lead image); omitted → product media. */
  mediaIds?: string[];
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
  /** Attributes shared by every variant; keys are translated in the UI. */
  attributes: ProductBaseAttributes;
  variants: ProductVariant[];
  /** Sequence number used by `buildSku` when the CMS generates variant SKUs. */
  skuSequence?: number;
};

/* ------------------------------------------------------------------ */
/* Translation records (one row per product × locale)                  */
/* ------------------------------------------------------------------ */

/** Free-text localized characteristic row (product page "Details"). */
export type ProductCharacteristic = {
  nameKey: string;
  name: string;
  value: string;
};

export type ProductOptionTranslation = {
  nameKey: string; // 'diameterCm' (variant attribute) or 'color'
  name: string; // 'Діаметр'
  valueKey: string; // '23'
  value: string; // '23 см'
  /** Swatch colour of an appearance value, copied from `ProductOption`. */
  swatch?: string;
};

export type ProductTranslation = {
  productId: string;
  languageCode: Locale;
  title: string;
  description: string;
  characteristics: ProductCharacteristic[];
  /** Labels of appearance options (`ProductVariant.options`). */
  options?: ProductOptionTranslation[];
  seo?: SeoFields;
};

/** Translation row of a badge (one per badge × locale). */
export type ProductBadgeTranslation = {
  badgeId: ProductBadgeStatus;
  languageCode: Locale;
  label: string;
};

/* ------------------------------------------------------------------ */
/* Resolved (locale-flattened) read models produced by the DAL         */
/* ------------------------------------------------------------------ */

/** Badge resolved for one locale. */
export type LocalizedProductBadge = {
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
  attributes: VariantAttributes;
  /** Selectable options: variant attributes first, then appearance options. */
  options: ProductOptionTranslation[];
  mediaIds?: string[];
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
  /** The collection's season slug; the product inherits it (`product.primaryCollection.season`). */
  season?: SeasonSlug;
};

/** Product resolved for one locale: core data + flattened translation. */
export type LocalizedProduct = Omit<Product, 'badges' | 'variants'> & {
  title: string;
  description: string;
  seo?: SeoFields;
  characteristics: ProductCharacteristic[];
  category: ProductCategoryRef;
  primaryCollection: ProductCollectionRef;
  badges: LocalizedProductBadge[];
  variants: ProductVariantTranslation[];
};

/** @deprecated Use `LocalizedProduct`. */
export type TProduct = LocalizedProduct;
