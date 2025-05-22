// entities/productCard/model/types.ts

import { Media } from '@/shared/types/media/media';

export type ProductOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  options: ProductOption[];
  price: number;
  available: boolean;
  images?: string[];
};

export interface ProductCardBase {
  id: string;
  title: string;
  slug: string;
  description?: string;
  media: Media[];
  price: number;
  currency: string;
  popular?: boolean;
  isNew?: boolean;
  tags?: string;
  isDiscounted?: boolean;
  available: boolean;
}

export interface Product extends ProductCardBase {
  variants?: ProductVariant[];
  options?: ProductOption[]; // available options to choose from
  brand?: string;
  category?: string;
  metadata?: Record<string, string>; // for custom props
}
