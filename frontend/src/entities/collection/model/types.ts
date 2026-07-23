import { type Media } from '@/shared/types';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string | string[];
  media: Media;
  // ID категорій, представлених у цій колекції (зручно для внутрішніх фільтрів на сторінці колекції)
  categoryIds: string[];
  // ID продуктів або завантажені продукти (залежно від того, де використовується тип)
  productIds?: string[];
  // Метадані для SEO (для повноцінної сторінки колекції це обов'язково знадобиться)
  seo?: {
    title?: string;
    description?: string;
  };
};
