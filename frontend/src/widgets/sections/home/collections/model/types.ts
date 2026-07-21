import { type Category } from '@/entities/category';
import { type Product } from '@/entities/product/model/types';

export type CollectionSlide = {
  id: string;
  slug: string;
  title: string;
  media: {
    id: string;
    src: string;
    alt?: string;
    poster?: string;
  };
  categories?: Category[];
  products?: Product[];
};
