import { type ProductType } from '../model/types';

export const productTypes: ProductType[] = [
  {
    id: '1',
    title: 'Platters',
    images: {
      url: '/images/productTypePlatters.webp',
      alt: 'Platters',
    },
    slug: 'platters',
  },
  {
    id: '2',
    title: 'Kettles',
    images: {
      url: '/images/productTypeKettles.webp',
      alt: 'Kettles',
    },
    slug: 'kettles',
  },
  {
    id: '3',
    title: 'Cups',
    images: {
      url: '/images/productTypeCups.webp',
      alt: 'Cups',
    },
    slug: 'cups',
  },
  {
    id: '4',
    title: 'Candlesticks',
    images: {
      url: '/images/productTypeCandlesticks.webp',
      alt: 'Candlesticks',
    },
    slug: 'candlesticks',
  },
];
