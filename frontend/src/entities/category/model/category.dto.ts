import { type CategorySlug } from '@/shared/config/routes';
import { type Media } from '@/shared/types';

export interface CategoryDTO {
  id: string;
  slug: CategorySlug;
  image: Media;
  productsCount?: number;
  title: string;
  description: string;
}
