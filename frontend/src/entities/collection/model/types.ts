import { Category } from '@/entities/category';
import { Product } from '@/entities/product/model/types';
import { Media } from '@/shared/types';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  media: Media;
  categories?: Category[];
  products?: Product[];
};
