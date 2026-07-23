import { type Category } from '@/entities/category';
import { type Media } from '@/shared/types';

// --- Base Types ---

export type ProductBadge =
  | 'new'
  | 'top'
  | 'pre_order'
  | 'bestseller'
  | 'limited'
  | 'most_popular'
  | 'sale';

export type ProductCurrency = 'UAH' | 'USD' | 'EUR';

export type ProductStockStatus = 'in_stock' | 'low_stock' | 'sold_out';

export const BADGE_LABELS: Record<ProductBadge, string> = {
  new: 'new',
  top: 'top',
  bestseller: 'hit sales',
  pre_order: 'pre-order',
  most_popular: 'most popular',
  limited: 'limited',
  sale: 'discount',
};

export const STOCK_STATUS_LABELS: Record<
  ProductStockStatus,
  { label: string; isAvailable: boolean }
> = {
  in_stock: { label: 'In stock', isAvailable: true },
  low_stock: { label: 'Low stock', isAvailable: true },
  sold_out: { label: 'Sold out', isAvailable: false },
};

export type ProductStock = {
  status: ProductStockStatus;
  quantity?: number;
};

export type Money = {
  amount: number;
  currency: ProductCurrency;
};

// --- Ref Types (для уникнення зайвих API запитів на фронті) ---

export type ProductCategoryRef = Pick<Category, 'id' | 'slug' | 'title'>;

export type ProductCollectionRef = {
  id: string;
  slug: string;
  title: string;
};

// --- Attributes & Options ---

// Перелік характеристик для фільтрації та специфікації (об'єм, розмір, матеріал)
export type ProductAttribute = {
  key: string; // e.g. 'volume', 'diameter', 'material'
  label: string; // e.g. 'Об'єм', 'Діаметр', 'Матеріал'
  value: string; // e.g. '350 мл', '22 см', 'Порцеляна'
};

// Опції для вибору варіації на стейті товару
export type ProductOption = {
  name: string; // e.g. 'Розмір'
  value: string; // e.g. 'M'
};

// --- Variants ---

export interface ProductVariant {
  id: string;
  sku: string;
  title?: string;
  price: Money;
  compareAtPrice?: Money;
  media?: Media[];
  stock: ProductStock;
  badges?: ProductBadge[];
  options: ProductOption[];
}

// --- Main Entity ---

export interface Product {
  id: string;
  slug: string;
  sku: string;
  title: string;
  description?: string;
  media: Media[];

  price: Money;
  compareAtPrice?: Money;

  stock: ProductStock;
  badges?: ProductBadge[];

  // Прив'язка до категорії (для фільтрів ?category=cups)
  category: ProductCategoryRef;

  // Колекція (для посилань на сторінку колекції /collections/[slug])
  primaryCollection: ProductCollectionRef;
  collections?: ProductCollectionRef[];

  // Специфічні характеристики (об'єм для склянки, діаметр для тарілки)
  attributes?: ProductAttribute[];

  // Варіанти та опції
  variants?: ProductVariant[];
  options?: ProductOption[];

  // UI state для клієнта
  isFavorite?: boolean;

  metadata?: Record<string, string>;
}

export type ProductCardDTO = {
  id: string;
  slug: string;
  sku: string;
  title: string;

  price: Money;
  compareAtPrice?: Money;
  media: {
    primary: Media;
    hover?: Media;
  };
  stock: ProductStock;
  badges?: ProductBadge[];
  primaryCollection: ProductCollectionRef;
  isFavorite: boolean;
};
