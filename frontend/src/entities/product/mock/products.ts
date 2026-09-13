import { getCategories } from '@/entities/category';
import { getCollections } from '@/entities/collection';
import { type Locale } from '@/shared/i18n/routing';

import { normalizeProduct, type TProduct } from '../lib/product-mapper';
import {
  type Product,
  type ProductBadge,
  type ProductBadgeStatus,
  type ProductBadgeTranslation,
  type ProductStockStatus,
  type ProductTranslation,
  type ProductWeightUnit,
} from '../model/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'konyushina-sets-two-plates-small-and-big',
    badges: ['pre_order'],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-1-1',
    attributes: [
      { nameKey: 'material', valueKey: 'high_temp_clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
      { nameKey: 'glaze_type', valueKey: 'glossy' },
    ],
    media: [
      {
        id: 'med-1-1',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-1-2',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-1-3',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-1-1',
        sku: 'NDP-01-22',
        price: { amount: 1200, currency: 'UAH' },
        compareAtPrice: { amount: 3200, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'diameter', valueKey: '22_cm' }],
        mediaId: 'med-1-1',
        weight: { weightUnit: 'g', weight: 2000 },
      },
      {
        id: 'var-1-2',
        sku: 'NDP-01-26',
        price: { amount: 1580, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'diameter', valueKey: '26_cm' }],
        weight: { weightUnit: 'g', weight: 400 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-2',
    slug: 'ceramic-tea-kettle-agro',
    badges: ['top'],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-2-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'heat_resistance', valueKey: 'high' },
      { nameKey: 'dishwasher', valueKey: 'hand_wash_only' },
      { nameKey: 'glaze_type', valueKey: 'matte' },
    ],
    media: [
      {
        id: 'med-2-1',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-2-2',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-2-1',
        sku: 'NDP-02-12',
        price: { amount: 1950, currency: 'UAH' },
        compareAtPrice: { amount: 2300, currency: 'UAH' },
        stock: { quantity: 5, lowStockThreshold: 2, allowBackorder: false },
        options: [{ nameKey: 'volume', valueKey: '1_2_l' }],
        mediaId: 'med-2-1',
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-3',
    slug: 'handcrafted-coffee-cup-set',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-3-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-3-1',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-3-2',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-3-3',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-3-1',
        sku: 'NDP-03',
        price: { amount: 480, currency: 'UAH' },
        stock: { quantity: 2, lowStockThreshold: 2, allowBackorder: false },
        options: [{ nameKey: 'volume', valueKey: '100ml' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-4',
    slug: 'vintage-candlestick-agro',
    badges: ['new'],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-4-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'care_instructions', valueKey: 'dry_wipe' },
      { nameKey: 'glaze_type', valueKey: 'textured' },
    ],
    media: [
      {
        id: 'med-4-1',
        src: '/images/products/p-new-year.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-4-2',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-4-1',
        sku: 'NDP-04',
        price: { amount: 890, currency: 'UAH' },
        compareAtPrice: { amount: 1100, currency: 'UAH' },
        stock: { quantity: 0, lowStockThreshold: 0, allowBackorder: false },
        options: [{ nameKey: 'height', valueKey: '18_cm' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-5',
    slug: 'stemmed-drinkware-glass',
    badges: ['new'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-5-1',
    attributes: [
      { nameKey: 'material', valueKey: 'blown_glass' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'not_safe' },
    ],
    media: [
      {
        id: 'med-5-1',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-5-2',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-5-1',
        sku: 'NDP-05-350',
        price: { amount: 620, currency: 'UAH' },
        stock: { quantity: 12, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '350ml' }],
        weight: { weightUnit: 'g', weight: 400 },
      },
      {
        id: 'var-5-2',
        sku: 'NDP-05-500',
        price: { amount: 740, currency: 'UAH' },
        stock: { quantity: 8, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '500ml' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-6',
    slug: 'dinnerware-full-set-agro',
    badges: ['top'],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-6-1',
    attributes: [
      { nameKey: 'material', valueKey: 'high_temp_clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-6-1',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-6-2',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-6-3',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-6-1',
        sku: 'NDP-06',
        price: { amount: 8400, currency: 'UAH' },
        compareAtPrice: { amount: 9600, currency: 'UAH' },
        stock: { quantity: 15, lowStockThreshold: 3, allowBackorder: true },
        options: [{ nameKey: 'pieces', valueKey: '12_pcs' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-7',
    slug: 'deep-pasta-plate-agro',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-7-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-7-1',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-7-2',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-7-1',
        sku: 'NDP-07',
        price: { amount: 790, currency: 'UAH' },
        stock: { quantity: 20, lowStockThreshold: 3, allowBackorder: true },
        options: [{ nameKey: 'diameter', valueKey: '24_cm' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-8',
    slug: 'ceramic-teapot-small',
    badges: [],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-8-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'hand_wash_only' },
      { nameKey: 'heat_resistance', valueKey: 'medium' },
    ],
    media: [
      {
        id: 'med-8-1',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-8-2',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-8-1',
        sku: 'NDP-08',
        price: { amount: 1350, currency: 'UAH' },
        stock: { quantity: 2, lowStockThreshold: 2, allowBackorder: false },
        options: [{ nameKey: 'volume', valueKey: '600ml' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-9',
    slug: 'tea-cup-with-saucer',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-9-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-9-1',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-9-2',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-9-1',
        sku: 'NDP-09',
        price: { amount: 690, currency: 'UAH' },
        compareAtPrice: { amount: 850, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '250ml' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-10',
    slug: 'sculptural-double-candlestick',
    badges: ['top'],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-10-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'care_instructions', valueKey: 'dry_wipe' },
    ],
    media: [
      {
        id: 'med-10-1',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-10-2',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-10-1',
        sku: 'NDP-10',
        price: { amount: 1250, currency: 'UAH' },
        stock: { quantity: 7, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'height', valueKey: '22_cm' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-11',
    slug: 'tall-water-glass-set',
    badges: ['most_popular'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-11-1',
    attributes: [
      { nameKey: 'material', valueKey: 'glass' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-11-1',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-11-2',
        src: '/images/products/p-new-year.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-11-1',
        sku: 'NDP-11',
        price: { amount: 980, currency: 'UAH' },
        stock: { quantity: 14, lowStockThreshold: 3, allowBackorder: true },
        options: [
          { nameKey: 'volume', valueKey: '450ml' },
          { nameKey: 'pieces', valueKey: '2_pcs' },
        ],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-12',
    slug: 'breakfast-set-two-persons',
    badges: ['pre_order'],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-12-1',
    attributes: [
      { nameKey: 'material', valueKey: 'high_temp_clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-12-1',
        src: '/images/products/p-new-year.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-12-2',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-12-3',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-12-1',
        sku: 'NDP-12',
        price: { amount: 3450, currency: 'UAH' },
        compareAtPrice: { amount: 4100, currency: 'UAH' },
        stock: { quantity: 6, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'pieces', valueKey: '6_pcs' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-13',
    slug: 'large-serving-platters',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-13-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-13-1',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-13-2',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-13-1',
        sku: 'NDP-13',
        price: { amount: 1850, currency: 'UAH' },
        stock: { quantity: 1, lowStockThreshold: 2, allowBackorder: false },
        options: [{ nameKey: 'size', valueKey: '38x24_cm' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-14',
    slug: 'stovetop-ceramic-kettle',
    badges: ['top'],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-14-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay_wood' },
      { nameKey: 'heat_resistance', valueKey: 'high' },
      { nameKey: 'dishwasher', valueKey: 'hand_wash_only' },
    ],
    media: [
      {
        id: 'med-14-1',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-14-2',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-14-1',
        sku: 'NDP-14',
        price: { amount: 2400, currency: 'UAH' },
        stock: { quantity: 0, lowStockThreshold: 0, allowBackorder: false },
        options: [{ nameKey: 'volume', valueKey: '1_5_l' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-15',
    slug: 'cappuccino-mug-agro',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-15-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-15-1',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-15-2',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-15-1',
        sku: 'NDP-15',
        price: { amount: 550, currency: 'UAH' },
        stock: { quantity: 18, lowStockThreshold: 3, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '350ml' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-16',
    slug: 'mini-candle-holder-pair',
    badges: ['new'],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-16-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'care_instructions', valueKey: 'dry_wipe' },
    ],
    media: [
      {
        id: 'med-16-1',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-16-2',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-16-1',
        sku: 'NDP-16',
        price: { amount: 720, currency: 'UAH' },
        compareAtPrice: { amount: 900, currency: 'UAH' },
        stock: { quantity: 8, lowStockThreshold: 2, allowBackorder: true },
        options: [
          { nameKey: 'height', valueKey: '8_cm' },
          { nameKey: 'pieces', valueKey: '2_pcs' },
        ],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-17',
    slug: 'colored-tinted-glass-cup',
    badges: [],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-17-1',
    attributes: [
      { nameKey: 'material', valueKey: 'borosilicate_glass' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'heat_resistance', valueKey: 'medium' },
    ],
    media: [
      {
        id: 'med-17-1',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-17-2',
        src: '/images/products/p-new-year.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-17-1',
        sku: 'NDP-17',
        price: { amount: 510, currency: 'UAH' },
        stock: { quantity: 25, lowStockThreshold: 5, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '300ml' }],
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-18',
    slug: 'ceramic-tea-set-for-four',
    badges: ['top'],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-18-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'dishwasher', valueKey: 'hand_wash_only' },
    ],
    media: [
      {
        id: 'med-18-1',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-18-2',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-18-3',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-18-1',
        sku: 'NDP-18',
        price: { amount: 3900, currency: 'UAH' },
        stock: { quantity: 4, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'pieces', valueKey: '5_pcs' }],
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-19',
    slug: 'small-side-dessert-plate',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-19-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-19-1',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-19-2',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-19-1',
        sku: 'NDP-19',
        price: { amount: 420, currency: 'UAH' },
        stock: { quantity: 11, lowStockThreshold: 3, allowBackorder: true },
        options: [{ nameKey: 'diameter', valueKey: '18_cm' }],
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-20',
    slug: 'gooseneck-pour-over-kettle',
    badges: ['pre_order'],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-20-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'dishwasher', valueKey: 'hand_wash_only' },
      { nameKey: 'heat_resistance', valueKey: 'high' },
    ],
    media: [
      {
        id: 'med-20-1',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-20-2',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-20-1',
        sku: 'NDP-20',
        price: { amount: 2850, currency: 'UAH' },
        compareAtPrice: { amount: 3100, currency: 'UAH' },
        stock: { quantity: 2, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '800ml' }],
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-21',
    slug: 'ceramic-matcha-bowl-cup',
    badges: [],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-21-1',
    attributes: [
      { nameKey: 'material', valueKey: 'clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-21-1',
        src: '/images/products/p-pumpking.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-21-2',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-21-1',
        sku: 'NDP-21',
        price: { amount: 840, currency: 'UAH' },
        stock: { quantity: 9, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '400ml' }],
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
    isFavorite: true,
  },
  {
    id: 'prod-22',
    slug: 'statement-floor-candlestick',
    badges: [],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-22-1',
    attributes: [
      { nameKey: 'material', valueKey: 'ceramic' },
      { nameKey: 'care_instructions', valueKey: 'dry_wipe' },
    ],
    media: [
      {
        id: 'med-22-1',
        src: '/images/products/p-new-year.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-22-2',
        src: '/images/products/p-flowers.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-22-1',
        sku: 'NDP-22',
        price: { amount: 3100, currency: 'UAH' },
        stock: { quantity: 0, lowStockThreshold: 0, allowBackorder: false },
        options: [{ nameKey: 'height', valueKey: '45_cm' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-23',
    slug: 'ribbed-whiskey-tumbler-glass',
    badges: ['new'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-23-1',
    attributes: [
      { nameKey: 'material', valueKey: 'glass' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-23-1',
        src: '/images/products/p-pink.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-23-2',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-23-1',
        sku: 'NDP-23',
        price: { amount: 460, currency: 'UAH' },
        compareAtPrice: { amount: 580, currency: 'UAH' },
        stock: { quantity: 1, lowStockThreshold: 3, allowBackorder: true },
        options: [{ nameKey: 'volume', valueKey: '300ml' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: false,
  },
  {
    id: 'prod-24',
    slug: 'starter-tableware-duo-set',
    badges: ['top'],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-24-1',
    attributes: [
      { nameKey: 'material', valueKey: 'high_temp_clay' },
      { nameKey: 'dishwasher', valueKey: 'safe' },
      { nameKey: 'microwave', valueKey: 'safe' },
    ],
    media: [
      {
        id: 'med-24-1',
        src: '/images/products/p-watermelon.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-24-2',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-24-3',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
    ],
    variants: [
      {
        id: 'var-24-1',
        sku: 'NDP-24',
        price: { amount: 1280, currency: 'UAH' },
        stock: { quantity: 0, lowStockThreshold: 2, allowBackorder: true },
        options: [{ nameKey: 'pieces', valueKey: '2_pcs' }],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
    isFavorite: true,
  },
];

export const MOCK_PRODUCT_TRANSLATIONS: ProductTranslation[] = [
  // prod-1
  {
    productId: 'prod-1',
    languageCode: 'en',
    title: 'Konyushina Sets Two Plates Small and Big',
    description:
      'An ideal plate for pasta, soups or fresh salads. Handmade, scratch resistant and dishwasher safe.',
    attributes: [
      {
        nameKey: 'material',
        name: 'Material',
        value: 'High temperature clay',
      },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
    options: [
      {
        nameKey: 'diameter',
        name: 'Diameter',
        valueKey: '22_cm',
        value: '22 cm',
      },
      {
        nameKey: 'diameter',
        name: 'Diameter',
        valueKey: '26_cm',
        value: '26 cm',
      },
    ],
  },
  {
    productId: 'prod-1',
    languageCode: 'uk',
    title: 'Набір із двох тарілок «Конюшина» (велика та мала)',
    description:
      'Ідеальні тарілки для пасти, супів чи свіжих салатів. Ручна робота, стійкі до подряпин, можна мити в посудомийці.',
    attributes: [
      {
        nameKey: 'material',
        name: 'Матеріал',
        value: 'Високотемпературна глина',
      },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
    options: [
      {
        nameKey: 'diameter',
        name: 'Діаметр',
        valueKey: '22_cm',
        value: '22 см',
      },
      {
        nameKey: 'diameter',
        name: 'Діаметр',
        valueKey: '26_cm',
        value: '26 см',
      },
    ],
  },

  // prod-2
  {
    productId: 'prod-2',
    languageCode: 'en',
    title: 'Handcrafted Ceramic Tea Kettle',
    description:
      'Cozy ceramic kettle perfect for tea ceremonies and long warm evenings.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
      { nameKey: 'origin', name: 'Origin', value: 'Ukraine' },
    ],
  },
  {
    productId: 'prod-2',
    languageCode: 'uk',
    title: 'Керамічний чайник ручної роботи',
    description:
      'Затишний керамічний чайник, ідеальний для чайних церемоній та довгих теплих вечорів.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Кераміка' },
      { nameKey: 'origin', name: 'Виробництво', value: 'Україна' },
    ],
  },

  // prod-3
  {
    productId: 'prod-3',
    languageCode: 'en',
    title: 'Rustic Espresso Cup Set',
    description:
      'Minimalist ceramic cup with ergonomic grip for morning espresso.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Clay' },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
  },
  {
    productId: 'prod-3',
    languageCode: 'uk',
    title: 'Набір чашок для еспресо в стилі Рустік',
    description:
      'Мінімалістична керамічна чашка з ергономічною ручкою для ранкового еспресо.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина' },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
  },

  // prod-4
  {
    productId: 'prod-4',
    languageCode: 'en',
    title: 'Tall Clay Candlestick',
    description:
      'Elegant handmade ceramic candle holder designed for dinner tables.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
      { nameKey: 'height', name: 'Height', value: '18 cm' },
    ],
  },
  {
    productId: 'prod-4',
    languageCode: 'uk',
    title: 'Високий глиняний свічник',
    description:
      'Елегантний керамічний свічник ручної роботи, створений для святкового столу.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Кераміка' },
      { nameKey: 'height', name: 'Висота', value: '18 см' },
    ],
  },

  // prod-5
  {
    productId: 'prod-5',
    languageCode: 'en',
    title: 'Textured Drinking Glass',
    description: 'Unique artisanal glass for water, juices, and soft drinks.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Blown Glass' },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
    options: [
      { nameKey: 'volume', name: 'Volume', valueKey: '350ml', value: '350 ml' },
      { nameKey: 'volume', name: 'Volume', valueKey: '500ml', value: '500 ml' },
    ],
  },
  {
    productId: 'prod-5',
    languageCode: 'uk',
    title: 'Текстурована склянка для напоїв',
    description:
      'Унікальна крафтова склянка для води, соків та безалкогольних напоїв.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Густе скло' },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
    options: [
      { nameKey: 'volume', name: "Об'єм", valueKey: '350ml', value: '350 мл' },
      { nameKey: 'volume', name: "Об'єм", valueKey: '500ml', value: '500 мл' },
    ],
  },

  // prod-6
  {
    productId: 'prod-6',
    languageCode: 'en',
    title: 'Complete Table Dinner Set (12 pcs)',
    description:
      'Complete dinnerware set including soup bowls, dinner plates, and dessert plates.',
    attributes: [
      {
        nameKey: 'material',
        name: 'Material',
        value: 'High temperature clay',
      },
      { nameKey: 'pieces', name: 'Items Count', value: '12 pcs' },
    ],
  },
  {
    productId: 'prod-6',
    languageCode: 'uk',
    title: 'Повний столовий сервіз (12 предм.)',
    description:
      'Повноцінний набір посуду, що включає супові піали, обідні та десертні тарілки.',
    attributes: [
      {
        nameKey: 'material',
        name: 'Матеріал',
        value: 'Високотемпературна глина',
      },
      { nameKey: 'pieces', name: 'Кількість предметів', value: '12 шт' },
    ],
  },

  // prod-7
  {
    productId: 'prod-7',
    languageCode: 'en',
    title: 'Deep Ceramic Pasta Plate',
    description:
      'Broad-brimmed deep ceramic plate designed for pasta, ramen, and salads.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Clay' },
      { nameKey: 'microwave', name: 'Microwave Safe', value: 'Yes' },
    ],
  },
  {
    productId: 'prod-7',
    languageCode: 'uk',
    title: 'Глибока керамічна тарілка для пасти',
    description:
      'Глибока тарілка з широкими бортиками для пасти, рамену та салатів.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина' },
      { nameKey: 'microwave', name: 'Мікрохвильовка', value: 'Так' },
    ],
  },

  // prod-8
  {
    productId: 'prod-8',
    languageCode: 'en',
    title: 'Compact Clay Teapot 600ml',
    description: 'Small ceramic teapot ideal for single-serving tea brewing.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Clay' },
      {
        nameKey: 'dishwasher',
        name: 'Dishwasher Safe',
        value: 'Hand wash recommended',
      },
    ],
  },
  {
    productId: 'prod-8',
    languageCode: 'uk',
    title: 'Компактний глиняний чайник 600мл',
    description:
      'Невеликий керамічний заварник, ідеальний для індивідуального чаювання.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина' },
      {
        nameKey: 'dishwasher',
        name: 'Догляд',
        value: 'Рекомендовано ручне миття',
      },
    ],
  },

  // prod-9
  {
    productId: 'prod-9',
    languageCode: 'en',
    title: 'Tea Cup with Match Saucer',
    description:
      'Crafted ceramic cup accompanied by a custom matching plate saucer.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
  },
  {
    productId: 'prod-9',
    languageCode: 'uk',
    title: 'Чайна чашка з блюдцем',
    description: 'Крафтова керамічна чашка у комплекті з авторським блюдцем.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Кераміка' },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
  },

  // prod-10
  {
    productId: 'prod-10',
    languageCode: 'en',
    title: 'Double Branch Ceramic Candlestick',
    description:
      'Artistic dual-holder candlestick for modern interior table decorations.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Handmade Ceramic' },
    ],
  },
  {
    productId: 'prod-10',
    languageCode: 'uk',
    title: 'Подвійний керамічний свічник',
    description:
      "Художній свічник на дві свічки для декору сучасного інтер'єру.",
    attributes: [
      {
        nameKey: 'material',
        name: 'Матеріал',
        value: 'Кераміка ручної роботи',
      },
    ],
  },

  // prod-11
  {
    productId: 'prod-11',
    languageCode: 'en',
    title: 'Highball Glassware Pair',
    description:
      'Pair of handcrafted tall glasses with organic subtle surface wave patterns.',
    attributes: [{ nameKey: 'count', name: 'Quantity in box', value: '2 pcs' }],
  },
  {
    productId: 'prod-11',
    languageCode: 'uk',
    title: 'Пара високих склянок Хайбол',
    description:
      'Пара високих склянок ручної роботи з легким хвилястим рельєфом.',
    attributes: [
      { nameKey: 'count', name: 'Кількість у наборі', value: '2 шт' },
    ],
  },

  // prod-12
  {
    productId: 'prod-12',
    languageCode: 'en',
    title: 'Breakfast Set for Two',
    description:
      'Includes 2 cups, 2 bowls, and 2 dessert plates designed for morning routine.',
    attributes: [{ nameKey: 'pieces', name: 'Set items', value: '6 pcs' }],
  },
  {
    productId: 'prod-12',
    languageCode: 'uk',
    title: 'Сніданковий набір на двох',
    description:
      'Включає 2 чашки, 2 піали та 2 десертні тарілки для ідеального ранку.',
    attributes: [
      { nameKey: 'pieces', name: 'Кількість предметів', value: '6 шт' },
    ],
  },

  // prod-13
  {
    productId: 'prod-13',
    languageCode: 'en',
    title: 'Oval Clay Serving Platter',
    description:
      'Large ceramic serving platter for baked goods, fruits, or main entrees.',
    attributes: [{ nameKey: 'size', name: 'Size', value: '38x24 cm' }],
  },
  {
    productId: 'prod-13',
    languageCode: 'uk',
    title: 'Овальне глиняне блюдо для подачі',
    description:
      'Велике керамічне блюдо для випічки, фруктів або основних страв.',
    attributes: [{ nameKey: 'size', name: 'Розмір', value: '38x24 см' }],
  },

  // prod-14
  {
    productId: 'prod-14',
    languageCode: 'en',
    title: 'Agro Classic Ceramic Kettle',
    description:
      'Heat-resistant clay kettle with natural wooden accent handle.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Clay & Wood' },
    ],
  },
  {
    productId: 'prod-14',
    languageCode: 'uk',
    title: 'Класичний керамічний чайник Agro',
    description: "Термостійкий глиняний чайник з дерев'яною ручкою.",
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина та дерево' },
    ],
  },

  // prod-15
  {
    productId: 'prod-15',
    languageCode: 'en',
    title: 'Wide Cappuccino Mug 350ml',
    description:
      'Hand-thrown wide cup engineered to retain latte art and foam.',
    attributes: [{ nameKey: 'material', name: 'Material', value: 'Ceramic' }],
  },
  {
    productId: 'prod-15',
    languageCode: 'uk',
    title: 'Широка чашка для капучино 350мл',
    description:
      'Широка кружка ручного гончарства, ідеальна для пишної пінки капучино.',
    attributes: [{ nameKey: 'material', name: 'Матеріал', value: 'Кераміка' }],
  },

  // prod-16
  {
    productId: 'prod-16',
    languageCode: 'en',
    title: 'Miniature Clay Candlesticks (Set of 2)',
    description:
      'Pair of low-profile rustic candle holders for tea lights or thin tapers.',
    attributes: [{ nameKey: 'count', name: 'Quantity', value: '2 pcs' }],
  },
  {
    productId: 'prod-16',
    languageCode: 'uk',
    title: 'Мініатюрні глиняні свічники (Набір з 2 шт)',
    description:
      'Пара низьких рустикальних свічників для чайних або тонких свічок.',
    attributes: [{ nameKey: 'count', name: 'Кількість', value: '2 шт' }],
  },

  // prod-17
  {
    productId: 'prod-17',
    languageCode: 'en',
    title: 'Amber Tinted Beverage Glass',
    description:
      'Handcrafted tinted glass ideal for chilled beverages and cocktails.',
    attributes: [
      { nameKey: 'material', name: 'Material', value: 'Borosilicate Glass' },
    ],
  },
  {
    productId: 'prod-17',
    languageCode: 'uk',
    title: 'Бурштинова тонована склянка',
    description:
      'Крафтова склянка з тонованого скла для холодних напоїв та коктейлів.',
    attributes: [
      { nameKey: 'material', name: 'Матеріал', value: 'Боросилікатне скло' },
    ],
  },

  // prod-18
  {
    productId: 'prod-18',
    languageCode: 'en',
    title: 'Complete Tea Set with Kettle & 4 Cups',
    description:
      'Matching tea ceremony set with 1L teapot and four matching ceramic cups.',
    attributes: [{ nameKey: 'pieces', name: 'Set items', value: '5 pcs' }],
  },
  {
    productId: 'prod-18',
    languageCode: 'uk',
    title: 'Чайний сервіз з чайником та 4 чашками',
    description:
      'Комплект для чайної церемонії з чайником на 1л та чотирма чашками.',
    attributes: [
      { nameKey: 'pieces', name: 'Кількість предметів', value: '5 шт' },
    ],
  },

  // prod-19
  {
    productId: 'prod-19',
    languageCode: 'en',
    title: 'Small Dessert Plate 18 cm',
    description:
      'Compact round plate for desserts, appetizers, or bread serving.',
    attributes: [{ nameKey: 'material', name: 'Material', value: 'Clay' }],
  },
  {
    productId: 'prod-19',
    languageCode: 'uk',
    title: 'Мала десертна тарілка 18 см',
    description:
      'Компактна кругла тарілка для десертів, закусок або подачі хліба.',
    attributes: [{ nameKey: 'material', name: 'Матеріал', value: 'Глина' }],
  },

  // prod-20
  {
    productId: 'prod-20',
    languageCode: 'en',
    title: 'Gooseneck Pour-Over Ceramic Kettle',
    description:
      'Designed specifically for precise water pouring during coffee brewing.',
    attributes: [{ nameKey: 'material', name: 'Material', value: 'Ceramic' }],
  },
  {
    productId: 'prod-20',
    languageCode: 'uk',
    title: 'Керамічний чайник для пуроверу',
    description:
      'Спеціально розроблений для точного протоку води при заварюванні кави.',
    attributes: [{ nameKey: 'material', name: 'Матеріал', value: 'Кераміка' }],
  },

  // prod-21
  {
    productId: 'prod-21',
    languageCode: 'en',
    title: 'Ceramic Matcha Chawan Bowl Cup',
    description:
      'Traditional wide-bottomed bowl for whisking and drinking ceremonial matcha.',
    attributes: [{ nameKey: 'material', name: 'Material', value: 'Clay' }],
  },
  {
    productId: 'prod-21',
    languageCode: 'uk',
    title: 'Керамічна піала Чаван для матча',
    description:
      'Традиційна піала з широким дном для збивання та пиття церемоніального чаю матча.',
    attributes: [{ nameKey: 'material', name: 'Матеріал', value: 'Глина' }],
  },

  // prod-22
  {
    productId: 'prod-22',
    languageCode: 'en',
    title: 'Grand Floor-Standing Ceramic Candlestick',
    description:
      'Large ceramic pillar candlestick making a bold statement in living spaces.',
    attributes: [{ nameKey: 'height', name: 'Height', value: '45 cm' }],
  },
  {
    productId: 'prod-22',
    languageCode: 'uk',
    title: 'Великий підлоговий керамічний свічник',
    description:
      "Масивний свічник-колона для створення виразного акценту в інтер'єрі.",
    attributes: [{ nameKey: 'height', name: 'Висота', value: '45 см' }],
  },

  // prod-23
  {
    productId: 'prod-23',
    languageCode: 'en',
    title: 'Ribbed Glass Tumbler',
    description:
      'Heavy-bottomed ribbed glass for whiskey, cocktails, or spirits on the rocks.',
    attributes: [{ nameKey: 'material', name: 'Material', value: 'Glass' }],
  },
  {
    productId: 'prod-23',
    languageCode: 'uk',
    title: 'Ребрована склянка для віскі',
    description:
      'Ребрована склянка з масивним дном для віскі, коктейлів або міцних напоїв з льодом.',
    attributes: [{ nameKey: 'material', name: 'Матеріал', value: 'Скло' }],
  },

  // prod-24
  {
    productId: 'prod-24',
    languageCode: 'en',
    title: 'Duo Plate & Mug Set',
    description: 'Matching set containing 1 multipurpose deep plate and 1 mug.',
    attributes: [{ nameKey: 'pieces', name: 'Set items', value: '2 pcs' }],
  },
  {
    productId: 'prod-24',
    languageCode: 'uk',
    title: 'Набір Дует: тарілка та кружка',
    description:
      'Лаконічний набір, що складається з 1 універсальної глибокої тарілки та 1 кружки.',
    attributes: [
      { nameKey: 'pieces', name: 'Кількість предметів', value: '2 шт' },
    ],
  },
];

export const MOCK_BADGES: Record<ProductBadgeStatus, ProductBadge> = {
  pre_order: {
    id: 'pre_order',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    translations: { uk: 'Передзамовлення', en: 'Pre-order' },
  },
  top: {
    id: 'top',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    translations: { uk: 'ТОП', en: 'TOP' },
  },
  new: {
    id: 'new',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    translations: { uk: 'Новинка', en: 'New' },
  },
  most_popular: {
    id: 'most_popular',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    translations: { uk: 'Хіт продажів', en: 'Most popular' },
  },
  bestseller: {
    id: 'bestseller',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    translations: { uk: 'Бестселер', en: 'Bestseller' },
  },
  limited: {
    id: 'limited',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    translations: { uk: 'Лімітована серія', en: 'Limited' },
  },
  sale: {
    id: 'sale',
    color: 'bg-red-100 text-red-800 border-red-200',
    translations: { uk: 'Знижка', en: 'Sale' },
  },
};

export const WEIGHT_UNITS_TRANSLATIONS: Record<
  ProductWeightUnit,
  Record<Locale, string>
> = {
  g: {
    uk: 'г',
    en: 'g',
  },
  kg: {
    uk: 'кг',
    en: 'kg',
  },
};

export const STOCK_TRANSLATIONS: Record<
  ProductStockStatus,
  Record<Locale, (quantity?: number) => string>
> = {
  in_stock: {
    uk: () => 'В наявності',
    en: () => 'In Stock',
  },
  low_stock: {
    uk: qty =>
      qty ? `Закінчується (лишилося ${qty} шт.)` : 'Мало в наявності',
    en: qty => (qty ? `Low stock (only ${qty} left)` : 'Low stock'),
  },
  out_of_stock: {
    uk: () => 'Немає в наявності',
    en: () => 'Out of Stock',
  },
  pre_order: {
    uk: () => 'Передзамовлення',
    en: () => 'Pre-order',
  },
};

export const STOCK_COLORS: Record<ProductStockStatus, string> = {
  in_stock: 'text-emerald-600 bg-emerald-50',
  low_stock: 'text-amber-600 bg-amber-50',
  out_of_stock: 'text-rose-600 bg-rose-50',
  pre_order: 'text-blue-600 bg-blue-50',
};

export async function getProductsWithTranslation(
  lang: Locale = 'uk',
): Promise<TProduct[]> {
  // 1. Отримуємо локалізовані категорії та колекції паралельно
  const [categories, collections] = await Promise.all([
    getCategories(lang),
    getCollections(lang),
  ]);

  // 2. Створюємо Map для швидкого О(1) пошуку перекладу продукту
  const translationsMap = new Map(
    MOCK_PRODUCT_TRANSLATIONS.filter(t => t.languageCode === lang).map(t => [
      t.productId,
      t,
    ]),
  );

  const categoriesMap = new Map(categories.map(c => [c.id, c]));
  const collectionsMap = new Map(collections.map(c => [c.id, c]));

  // 3. Нормалізуємо кожен товар
  return MOCK_PRODUCTS.map(product => {
    const translation = translationsMap.get(product.id);
    const category = categoriesMap.get(product.categoryId);
    const collection = collectionsMap.get(product.primaryCollectionId);

    // Збираємо локалізовані бейджі
    const localizedBadges: ProductBadgeTranslation[] = (
      product.badges || []
    ).map(badgeId => {
      const catalogItem = MOCK_BADGES[badgeId];
      const label = catalogItem?.translations?.[lang] || badgeId;
      return {
        id: badgeId,
        label,
        color: catalogItem?.color,
      };
    });

    // Викликаємо єдине джерело правди для нормалізації
    return normalizeProduct(
      product,
      translation,
      category,
      collection,
      localizedBadges,
      lang,
    );
  });
}
