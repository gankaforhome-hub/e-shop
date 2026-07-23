import { type Media } from '@/shared/types';

export type CategorySlug =
  'plates' | 'sets' | 'kettles' | 'cups' | 'candlesticks' | 'glass';

export type Category = {
  id: string;
  slug: CategorySlug;
  title: string;
  description?: string;
  image: Media;
  // Корисно мати count для UI (показувати "Чашки (24)"), якщо будеш виводити лічильники в фільтрах
  productsCount?: number;
};
