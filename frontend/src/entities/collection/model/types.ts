import { type Category } from '@/entities/category';
import { type Product } from '@/entities/product/model/types';
import { type Media } from '@/shared/types';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  media: Media;
  categories?: Category[];
  products?: Product[];
};
