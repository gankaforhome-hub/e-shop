import { Category } from '@/entities/category';
import { Product } from '@/entities/product/model/types';

export type CollectionSlide = {
  id: string;
  slug: string;
  title: string;
  media: {
    id: string;
    type: 'image' | 'video';
    src: string;
    alt?: string;
    poster?: string;
  };
  categories?: Category[];
  products?: Product[];
};
