import { type Category } from '../model/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    title: 'Plates',
    slug: 'plates',
    description: "Large and dessert plates with author's ceramics",
    image: {
      src: '/images/category/cat-plates.png',
      alt: 'Ceramic plates',
    },
    productsCount: 12,
  },
  {
    id: 'cat-2',
    title: 'Sets',
    slug: 'sets',
    description: 'Ready sets for serving the table',
    image: {
      id: 'cat-sets',
      src: '/images/category/cat-sets.png',
      alt: 'Dinnerware sets',
    },
    productsCount: 4,
  },
  {
    id: 'cat-3',
    title: 'Kettles',
    slug: 'kettles',
    description: 'Ceramic and glass teapots for brewing',
    image: {
      src: '/images/category/cat-kettles.png',
      alt: 'Ceramic kettles',
    },
    productsCount: 5,
  },
  {
    id: 'cat-4',
    title: 'Cups',
    slug: 'cups',
    description: 'Cozy cups for tea, coffee and morning rituals',
    image: {
      src: '/images/category/cat-cups.png',
      alt: 'Ceramic cups',
    },
    productsCount: 18,
  },
  {
    id: 'cat-5',
    title: 'Candlesticks',
    slug: 'candlesticks',
    description: 'Decorative candlesticks for atmospheric evenings',
    image: {
      id: 'cat-candlesticks',
      src: '/images/category/cat-candlesticks.png',
      alt: 'Ceramic candlesticks',
    },
    productsCount: 7,
  },
  {
    id: 'cat-6',
    title: 'Glass',
    slug: 'glass',
    description: 'Elegant glassware for drinks and cocktails',
    image: {
      src: '/images/category/cat-glass.png',
      alt: 'Glass collection',
    },
    productsCount: 9,
  },
];
