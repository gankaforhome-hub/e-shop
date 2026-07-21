import { type Media } from '@/shared/types';

export type CategorySlug =
  'plates' | 'sets' | 'kettles' | 'cups' | 'candlesticks' | 'glass';

export type Category = {
  id: string;
  slug: string;
  title: string;
  image: Media;
};

export const categories: Category[] = [
  {
    id: '1',
    title: 'Plates',
    slug: 'plates',
    image: {
      id: 'cat-plates',
      type: 'image',
      src: '/images/category/cat-plates.jpg',
      alt: 'Ceramic plates',
    },
  },
  {
    id: '2',
    title: 'Sets',
    slug: 'sets',
    image: {
      id: 'cat-sets',
      type: 'image',
      src: '/images/category/cat-sets.jpg',
      alt: 'Dinnerware sets',
    },
  },
  {
    id: '3',
    title: 'Kettles',
    slug: 'kettles',
    image: {
      id: 'cat-kettles',
      type: 'image',
      src: '/images/category/cat-kettles.jpg',
      alt: 'Ceramic kettles',
    },
  },
  {
    id: '4',
    title: 'Cups',
    slug: 'cups',
    image: {
      id: 'cat-cups',
      type: 'image',
      src: '/images/category/cat-cups.jpg',
      alt: 'Ceramic cups',
    },
  },
  {
    id: '5',
    title: 'Candlesticks',
    slug: 'candlesticks',
    image: {
      id: 'cat-candlesticks',
      type: 'image',
      src: '/images/category/cat-candlesticks.jpg',
      alt: 'Ceramic candlesticks',
    },
  },
  {
    id: '6',
    title: 'Glass',
    slug: 'glass',
    image: {
      id: 'cat-glass',
      type: 'image',
      src: '/images/category/cat-glass.jpg',
      alt: 'Glass collection',
    },
  },
];
