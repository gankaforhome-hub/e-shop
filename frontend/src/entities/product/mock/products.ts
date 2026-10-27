import {
  type Product,
  type ProductBadge,
  type ProductBadgeStatus,
  type ProductBadgeTranslation,
  type ProductTranslation,
} from '../model/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'konyushina-sets-two-plates-small-and-big',
    createdAt: '2026-01-14T10:00:00.000Z',
    badges: ['pre_order'],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-13',
    featuredMediaId: 'med-1-1',
    attributes: {
      glazeType: 'glossy',
      material: 'porcelain',
      colorDecoration: 'hand_painted',
      plateType1: 'rimmed',
      plateType2: 'dinner',
      shape: 'round',
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
      {
        id: 'med-1-4',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-1-5',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-1-6',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-1-7',
        src: '/images/products/p-angels.webp',
        objectFit: 'contain',
      },
      {
        id: 'med-1-8',
        src: '/images/products/p-birds.webp',
        objectFit: 'cover',
      },
      {
        id: 'med-1-9',
        src: '/images/products/p-eggplant.webp',
        objectFit: 'cover',
      },
    ],
    variants: [
      {
        id: 'var-1-1',
        sku: 'NDP-01-23',
        price: { amount: 1200, currency: 'UAH' },
        compareAtPrice: { amount: 3200, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        attributes: { diameterCm: 23 },
        options: [
          { nameKey: 'color', valueKey: 'forest_red', swatch: '#ff0019' },
        ],
        mediaIds: ['med-1-1', 'med-1-2', 'med-1-4'],
        weight: { weightUnit: 'g', weight: 2000 },
      },
      {
        id: 'var-1-2',
        sku: 'NDP-01-27',
        price: { amount: 1580, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        attributes: { diameterCm: 27 },
        options: [
          { nameKey: 'color', valueKey: 'forest_yellow', swatch: '#bb9900' },
        ],
        mediaIds: ['med-1-3', 'med-1-6', 'med-1-9'],
        weight: { weightUnit: 'g', weight: 400 },
      },
      {
        id: 'var-1-3',
        sku: 'NDP-01-23Y',
        price: { amount: 1600, currency: 'UAH' },
        compareAtPrice: { amount: 3200, currency: 'UAH' },
        stock: { quantity: 10, lowStockThreshold: 2, allowBackorder: true },
        attributes: { diameterCm: 23 },
        options: [
          { nameKey: 'color', valueKey: 'forest_yellow', swatch: '#bb9900' },
        ],
        mediaIds: ['med-1-7', 'med-1-8'],
        weight: { weightUnit: 'g', weight: 2000 },
      },
    ],
  },
  {
    id: 'prod-2',
    slug: 'ceramic-tea-kettle-agro',
    createdAt: '2026-01-23T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-2-1',
    attributes: {
      glazeType: 'matte',
      material: 'ceramic',
      colorDecoration: 'coloured',
      isDishwasherSafe: false,
    },
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
        attributes: { volumeMl: 1000, servesCount: 5 },
        mediaIds: ['med-2-1'],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
  },
  {
    id: 'prod-3',
    slug: 'handcrafted-coffee-cup-set',
    createdAt: '2026-02-01T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-12',
    featuredMediaId: 'med-3-1',
    attributes: {
      material: 'ceramic',
      colorDecoration: 'coloured',
      cupType: 'coffee',
      hasSaucer: false,
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
        sku: 'NDP-03-250',
        price: { amount: 480, currency: 'UAH' },
        stock: { quantity: 2, lowStockThreshold: 2, allowBackorder: false },
        attributes: { volumeMl: 250 },
        mediaIds: ['med-3-1', 'med-3-2'],
        weight: { weightUnit: 'g', weight: 300 },
      },
      {
        id: 'var-3-2',
        sku: 'NDP-03-300',
        price: { amount: 560, currency: 'UAH' },
        stock: { quantity: 6, lowStockThreshold: 2, allowBackorder: false },
        attributes: { volumeMl: 300 },
        mediaIds: ['med-3-3', 'med-3-1'],
        weight: { weightUnit: 'g', weight: 340 },
      },
    ],
  },
  {
    id: 'prod-4',
    slug: 'vintage-candlestick-agro',
    createdAt: '2026-02-10T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-4',
    featuredMediaId: 'med-4-1',
    attributes: {
      material: 'soy_wax',
      waxType: 'soy',
      vesselMaterial: 'ceramic',
    },
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
        sku: 'NDP-04-50',
        price: { amount: 890, currency: 'UAH' },
        compareAtPrice: { amount: 1100, currency: 'UAH' },
        stock: { quantity: 0, lowStockThreshold: 0, allowBackorder: false },
        attributes: { burnTimeHours: 50, heightCm: 9, scent: 'scented' },
        mediaIds: ['med-4-1', 'med-4-2'],
        weight: { weightUnit: 'g', weight: 300 },
      },
      {
        id: 'var-4-2',
        sku: 'NDP-04-75',
        price: { amount: 1190, currency: 'UAH' },
        stock: { quantity: 4, lowStockThreshold: 2, allowBackorder: false },
        attributes: { burnTimeHours: 75, heightCm: 11, scent: 'scented' },
        mediaIds: ['med-4-2', 'med-4-1'],
        weight: { weightUnit: 'g', weight: 420 },
      },
    ],
  },
  {
    id: 'prod-5',
    slug: 'stemmed-drinkware-glass',
    createdAt: '2026-02-19T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-12',
    featuredMediaId: 'med-5-1',
    attributes: {
      material: 'glass',
      colorDecoration: 'coloured',
      isDishwasherSafe: true,
    },
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
        sku: 'NDP-05-400',
        price: { amount: 620, currency: 'UAH' },
        stock: { quantity: 12, lowStockThreshold: 2, allowBackorder: true },
        attributes: { volumeMl: 400 },
        mediaIds: ['med-5-1', 'med-5-2'],
        weight: { weightUnit: 'g', weight: 400 },
      },
      {
        id: 'var-5-2',
        sku: 'NDP-05-500',
        price: { amount: 740, currency: 'UAH' },
        stock: { quantity: 8, lowStockThreshold: 2, allowBackorder: true },
        attributes: { volumeMl: 500 },
        mediaIds: ['med-5-2', 'med-5-1'],
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
  },
  {
    id: 'prod-6',
    slug: 'dinnerware-full-set-agro',
    createdAt: '2026-02-28T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-2',
    featuredMediaId: 'med-6-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'hand_painted',
      setType: 'tea',
      setContents: ['cups', 'saucers', 'teapot'],
      isDishwasherSafe: true,
    },
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
        attributes: { servesCount: 6, piecesCount: 13 },
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
  },
  {
    id: 'prod-7',
    slug: 'deep-pasta-plate-agro',
    createdAt: '2026-03-09T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-13',
    featuredMediaId: 'med-7-1',
    attributes: {
      glazeType: 'matte',
      material: 'ceramic',
      colorDecoration: 'coloured',
      plateType1: 'flat',
      plateType2: 'dessert',
      shape: 'round',
      isDishwasherSafe: true,
      isMicrowaveSafe: false,
    },
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
        attributes: { diameterCm: 18 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-8',
    slug: 'ceramic-teapot-small',
    createdAt: '2026-03-18T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-14',
    featuredMediaId: 'med-8-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'hand_painted',
      isDishwasherSafe: true,
    },
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
        sku: 'NDP-08-800',
        price: { amount: 1350, currency: 'UAH' },
        stock: { quantity: 2, lowStockThreshold: 2, allowBackorder: false },
        attributes: { volumeMl: 800, servesCount: 4 },
        mediaIds: ['med-8-1', 'med-8-2'],
        weight: { weightUnit: 'g', weight: 500 },
      },
      {
        id: 'var-8-2',
        sku: 'NDP-08-1000',
        price: { amount: 1650, currency: 'UAH' },
        stock: { quantity: 5, lowStockThreshold: 2, allowBackorder: false },
        attributes: { volumeMl: 1000, servesCount: 6 },
        mediaIds: ['med-8-2', 'med-8-1'],
        weight: { weightUnit: 'g', weight: 640 },
      },
    ],
  },
  {
    id: 'prod-9',
    slug: 'tea-cup-with-saucer',
    createdAt: '2026-03-27T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-10',
    featuredMediaId: 'med-9-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'hand_painted',
      cupType: 'teacup',
      hasSaucer: true,
      isDishwasherSafe: true,
    },
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
        attributes: { volumeMl: 300 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-10',
    slug: 'sculptural-double-candlestick',
    createdAt: '2026-04-05T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-6',
    featuredMediaId: 'med-10-1',
    attributes: {
      material: 'soy_wax',
      waxType: 'soy',
      vesselMaterial: 'porcelain',
    },
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
        attributes: { scent: 'unscented', burnTimeHours: 75, heightCm: 11 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-11',
    slug: 'tall-water-glass-set',
    createdAt: '2026-04-14T10:00:00.000Z',
    badges: ['most_popular'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-12',
    featuredMediaId: 'med-11-1',
    attributes: {
      material: 'glass',
      colorDecoration: 'gold_platinum_trim',
      isDishwasherSafe: false,
    },
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
        attributes: { volumeMl: 400 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-12',
    slug: 'breakfast-set-two-persons',
    createdAt: '2026-04-23T10:00:00.000Z',
    badges: ['pre_order'],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-9',
    featuredMediaId: 'med-12-1',
    attributes: {
      material: 'ceramic',
      colorDecoration: 'coloured',
      setType: 'coffee',
      setContents: ['cups', 'saucers'],
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
        attributes: { servesCount: 2, piecesCount: 4 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-13',
    slug: 'large-serving-platters',
    createdAt: '2026-05-02T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-3',
    featuredMediaId: 'med-13-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'gold_platinum_trim',
      plateType1: 'flat',
      plateType2: 'serving',
      shape: 'oval',
      isDishwasherSafe: false,
      isMicrowaveSafe: false,
    },
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
        attributes: { diameterCm: 31 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-14',
    slug: 'stovetop-ceramic-kettle',
    createdAt: '2026-05-11T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-14',
    featuredMediaId: 'med-14-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'white',
      isDishwasherSafe: true,
    },
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
        attributes: { volumeMl: 500, servesCount: 2 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-15',
    slug: 'cappuccino-mug-agro',
    createdAt: '2026-05-20T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-7',
    featuredMediaId: 'med-15-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'white',
      cupType: 'espresso',
      hasSaucer: true,
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
        attributes: { volumeMl: 150 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-16',
    slug: 'mini-candle-holder-pair',
    createdAt: '2026-05-29T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-1',
    featuredMediaId: 'med-16-1',
    attributes: {
      material: 'soy_wax',
      waxType: 'soy',
      vesselMaterial: 'glass',
    },
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
        attributes: { scent: 'scented', burnTimeHours: 35, heightCm: 7 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-17',
    slug: 'colored-tinted-glass-cup',
    createdAt: '2026-06-07T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-7',
    featuredMediaId: 'med-17-1',
    attributes: {
      material: 'glass',
      colorDecoration: 'white',
      isDishwasherSafe: true,
    },
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
        attributes: { volumeMl: 300 },
        weight: { weightUnit: 'g', weight: 500 },
      },
    ],
  },
  {
    id: 'prod-18',
    slug: 'ceramic-tea-set-for-four',
    createdAt: '2026-06-16T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-6',
    featuredMediaId: 'med-18-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'gold_platinum_trim',
      setType: 'dinner',
      setContents: ['plates'],
      isDishwasherSafe: false,
    },
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
        attributes: { servesCount: 4, piecesCount: 12 },
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
  },
  {
    id: 'prod-19',
    slug: 'small-side-dessert-plate',
    createdAt: '2026-06-25T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-1',
    primaryCollectionId: 'col-13',
    featuredMediaId: 'med-19-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'white',
      plateType1: 'rimmed',
      plateType2: 'soup',
      shape: 'conical',
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
        attributes: { diameterCm: 23 },
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
  },
  {
    id: 'prod-20',
    slug: 'gooseneck-pour-over-kettle',
    createdAt: '2026-07-04T10:00:00.000Z',
    badges: ['pre_order'],
    categoryId: 'cat-3',
    primaryCollectionId: 'col-9',
    featuredMediaId: 'med-20-1',
    attributes: {
      material: 'glass',
      colorDecoration: 'gold_platinum_trim',
      isDishwasherSafe: false,
    },
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
        attributes: { volumeMl: 1000, servesCount: 6 },
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
  },
  {
    id: 'prod-21',
    slug: 'ceramic-matcha-bowl-cup',
    createdAt: '2026-07-13T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-4',
    primaryCollectionId: 'col-7',
    featuredMediaId: 'med-21-1',
    attributes: {
      material: 'porcelain',
      colorDecoration: 'gold_platinum_trim',
      cupType: 'teacup',
      hasSaucer: true,
      isDishwasherSafe: false,
    },
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
        attributes: { volumeMl: 380 },
        weight: { weightUnit: 'g', weight: 1000 },
      },
    ],
  },
  {
    id: 'prod-22',
    slug: 'statement-floor-candlestick',
    createdAt: '2026-07-22T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-5',
    primaryCollectionId: 'col-8',
    featuredMediaId: 'med-22-1',
    attributes: {
      material: 'soy_wax',
      waxType: 'soy',
      vesselMaterial: 'porcelain',
    },
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
        attributes: { scent: 'scented', burnTimeHours: 50, heightCm: 9 },
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
  },
  {
    id: 'prod-23',
    slug: 'ribbed-whiskey-tumbler-glass',
    createdAt: '2026-07-31T10:00:00.000Z',
    badges: ['new'],
    categoryId: 'cat-6',
    primaryCollectionId: 'col-12',
    featuredMediaId: 'med-23-1',
    attributes: {
      material: 'glass',
      colorDecoration: 'hand_painted',
      isDishwasherSafe: true,
    },
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
        attributes: { volumeMl: 500 },
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
  },
  {
    id: 'prod-24',
    slug: 'starter-tableware-duo-set',
    createdAt: '2026-08-09T10:00:00.000Z',
    badges: [],
    categoryId: 'cat-2',
    primaryCollectionId: 'col-2',
    featuredMediaId: 'med-24-1',
    attributes: {
      material: 'ceramic',
      colorDecoration: 'white',
      setType: 'combination',
      setContents: ['cups', 'plates', 'jug'],
      isDishwasherSafe: true,
      isMicrowaveSafe: true,
    },
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
        attributes: { servesCount: 4, piecesCount: 9 },
        weight: { weightUnit: 'g', weight: 300 },
      },
    ],
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
    characteristics: [
      {
        nameKey: 'material',
        name: 'Material',
        value: 'High temperature clay',
      },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
    options: [
      {
        nameKey: 'color',
        name: 'Color',
        valueKey: 'forest_red',
        value: 'Forest red',
      },
      {
        nameKey: 'color',
        name: 'Color',
        valueKey: 'forest_yellow',
        value: 'Forest yellow',
      },
    ],
  },
  {
    productId: 'prod-1',
    languageCode: 'uk',
    title: 'Набір із двох тарілок «Конюшина» (велика та мала)',
    description:
      'Ідеальні тарілки для пасти, супів чи свіжих салатів. Ручна робота, стійкі до подряпин, можна мити в посудомийці.',
    characteristics: [
      {
        nameKey: 'material',
        name: 'Матеріал',
        value: 'Високотемпературна глина',
      },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
    options: [
      {
        nameKey: 'color',
        name: 'Колір',
        valueKey: 'forest_red',
        value: 'Лісовий червоний',
      },
      {
        nameKey: 'color',
        name: 'Колір',
        valueKey: 'forest_yellow',
        value: 'Лісовий жовтий',
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Blown Glass' },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
  },
  {
    productId: 'prod-5',
    languageCode: 'uk',
    title: 'Текстурована склянка для напоїв',
    description:
      'Унікальна крафтова склянка для води, соків та безалкогольних напоїв.',
    characteristics: [
      { nameKey: 'material', name: 'Матеріал', value: 'Густе скло' },
      { nameKey: 'dishwasher', name: 'Посудомийна машина', value: 'Так' },
    ],
  },

  // prod-6
  {
    productId: 'prod-6',
    languageCode: 'en',
    title: 'Complete Table Dinner Set (12 pcs)',
    description:
      'Complete dinnerware set including soup bowls, dinner plates, and dessert plates.',
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
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
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
      { nameKey: 'dishwasher', name: 'Dishwasher Safe', value: 'Yes' },
    ],
  },
  {
    productId: 'prod-9',
    languageCode: 'uk',
    title: 'Чайна чашка з блюдцем',
    description: 'Крафтова керамічна чашка у комплекті з авторським блюдцем.',
    characteristics: [
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
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Handmade Ceramic' },
    ],
  },
  {
    productId: 'prod-10',
    languageCode: 'uk',
    title: 'Подвійний керамічний свічник',
    description:
      "Художній свічник на дві свічки для декору сучасного інтер'єру.",
    characteristics: [
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
    characteristics: [
      { nameKey: 'count', name: 'Quantity in box', value: '2 pcs' },
    ],
  },
  {
    productId: 'prod-11',
    languageCode: 'uk',
    title: 'Пара високих склянок Хайбол',
    description:
      'Пара високих склянок ручної роботи з легким хвилястим рельєфом.',
    characteristics: [
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
    characteristics: [{ nameKey: 'pieces', name: 'Set items', value: '6 pcs' }],
  },
  {
    productId: 'prod-12',
    languageCode: 'uk',
    title: 'Сніданковий набір на двох',
    description:
      'Включає 2 чашки, 2 піали та 2 десертні тарілки для ідеального ранку.',
    characteristics: [
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
    characteristics: [{ nameKey: 'size', name: 'Size', value: '38x24 cm' }],
  },
  {
    productId: 'prod-13',
    languageCode: 'uk',
    title: 'Овальне глиняне блюдо для подачі',
    description:
      'Велике керамічне блюдо для випічки, фруктів або основних страв.',
    characteristics: [{ nameKey: 'size', name: 'Розмір', value: '38x24 см' }],
  },

  // prod-14
  {
    productId: 'prod-14',
    languageCode: 'en',
    title: 'Agro Classic Ceramic Kettle',
    description:
      'Heat-resistant clay kettle with natural wooden accent handle.',
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Clay & Wood' },
    ],
  },
  {
    productId: 'prod-14',
    languageCode: 'uk',
    title: 'Класичний керамічний чайник Agro',
    description: "Термостійкий глиняний чайник з дерев'яною ручкою.",
    characteristics: [
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
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
    ],
  },
  {
    productId: 'prod-15',
    languageCode: 'uk',
    title: 'Широка чашка для капучино 350мл',
    description:
      'Широка кружка ручного гончарства, ідеальна для пишної пінки капучино.',
    characteristics: [
      { nameKey: 'material', name: 'Матеріал', value: 'Кераміка' },
    ],
  },

  // prod-16
  {
    productId: 'prod-16',
    languageCode: 'en',
    title: 'Miniature Clay Candlesticks (Set of 2)',
    description:
      'Pair of low-profile rustic candle holders for tea lights or thin tapers.',
    characteristics: [{ nameKey: 'count', name: 'Quantity', value: '2 pcs' }],
  },
  {
    productId: 'prod-16',
    languageCode: 'uk',
    title: 'Мініатюрні глиняні свічники (Набір з 2 шт)',
    description:
      'Пара низьких рустикальних свічників для чайних або тонких свічок.',
    characteristics: [{ nameKey: 'count', name: 'Кількість', value: '2 шт' }],
  },

  // prod-17
  {
    productId: 'prod-17',
    languageCode: 'en',
    title: 'Amber Tinted Beverage Glass',
    description:
      'Handcrafted tinted glass ideal for chilled beverages and cocktails.',
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Borosilicate Glass' },
    ],
  },
  {
    productId: 'prod-17',
    languageCode: 'uk',
    title: 'Бурштинова тонована склянка',
    description:
      'Крафтова склянка з тонованого скла для холодних напоїв та коктейлів.',
    characteristics: [
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
    characteristics: [{ nameKey: 'pieces', name: 'Set items', value: '5 pcs' }],
  },
  {
    productId: 'prod-18',
    languageCode: 'uk',
    title: 'Чайний сервіз з чайником та 4 чашками',
    description:
      'Комплект для чайної церемонії з чайником на 1л та чотирма чашками.',
    characteristics: [
      { nameKey: 'pieces', name: 'Кількість предметів', value: '5 шт' },
    ],
  },

  {
    productId: 'prod-19',
    languageCode: 'en',
    title: 'Small Dessert Plate',
    description:
      'Compact round plate for desserts, appetizers, or bread serving.',
    characteristics: [{ nameKey: 'material', name: 'Material', value: 'Clay' }],
  },
  {
    productId: 'prod-19',
    languageCode: 'uk',
    title: 'Мала десертна тарілка',
    description:
      'Компактна кругла тарілка для десертів, закусок або подачі хліба.',
    characteristics: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина' },
    ],
  },

  // prod-20
  {
    productId: 'prod-20',
    languageCode: 'en',
    title: 'Gooseneck Pour-Over Ceramic Kettle',
    description:
      'Designed specifically for precise water pouring during coffee brewing.',
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Ceramic' },
    ],
  },
  {
    productId: 'prod-20',
    languageCode: 'uk',
    title: 'Керамічний чайник для пуроверу',
    description:
      'Спеціально розроблений для точного протоку води при заварюванні кави.',
    characteristics: [
      { nameKey: 'material', name: 'Матеріал', value: 'Кераміка' },
    ],
  },

  // prod-21
  {
    productId: 'prod-21',
    languageCode: 'en',
    title: 'Ceramic Matcha Chawan Bowl Cup',
    description:
      'Traditional wide-bottomed bowl for whisking and drinking ceremonial matcha.',
    characteristics: [{ nameKey: 'material', name: 'Material', value: 'Clay' }],
  },
  {
    productId: 'prod-21',
    languageCode: 'uk',
    title: 'Керамічна піала Чаван для матча',
    description:
      'Традиційна піала з широким дном для збивання та пиття церемоніального чаю матча.',
    characteristics: [
      { nameKey: 'material', name: 'Матеріал', value: 'Глина' },
    ],
  },

  // prod-22
  {
    productId: 'prod-22',
    languageCode: 'en',
    title: 'Grand Floor-Standing Ceramic Candlestick',
    description:
      'Large ceramic pillar candlestick making a bold statement in living spaces.',
    characteristics: [{ nameKey: 'height', name: 'Height', value: '45 cm' }],
  },
  {
    productId: 'prod-22',
    languageCode: 'uk',
    title: 'Великий підлоговий керамічний свічник',
    description:
      "Масивний свічник-колона для створення виразного акценту в інтер'єрі.",
    characteristics: [{ nameKey: 'height', name: 'Висота', value: '45 см' }],
  },

  // prod-23
  {
    productId: 'prod-23',
    languageCode: 'en',
    title: 'Ribbed Glass Tumbler',
    description:
      'Heavy-bottomed ribbed glass for whiskey, cocktails, or spirits on the rocks.',
    characteristics: [
      { nameKey: 'material', name: 'Material', value: 'Glass' },
    ],
  },
  {
    productId: 'prod-23',
    languageCode: 'uk',
    title: 'Ребрована склянка для віскі',
    description:
      'Ребрована склянка з масивним дном для віскі, коктейлів або міцних напоїв з льодом.',
    characteristics: [{ nameKey: 'material', name: 'Матеріал', value: 'Скло' }],
  },

  // prod-24
  {
    productId: 'prod-24',
    languageCode: 'en',
    title: 'Duo Plate & Mug Set',
    description: 'Matching set containing 1 multipurpose deep plate and 1 mug.',
    characteristics: [{ nameKey: 'pieces', name: 'Set items', value: '2 pcs' }],
  },
  {
    productId: 'prod-24',
    languageCode: 'uk',
    title: 'Набір Дует: тарілка та кружка',
    description:
      'Лаконічний набір, що складається з 1 універсальної глибокої тарілки та 1 кружки.',
    characteristics: [
      { nameKey: 'pieces', name: 'Кількість предметів', value: '2 шт' },
    ],
  },
];

export const MOCK_BADGES: Record<ProductBadgeStatus, ProductBadge> = {
  pre_order: {
    id: 'pre_order',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  new: {
    id: 'new',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  most_popular: {
    id: 'most_popular',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  bestseller: {
    id: 'bestseller',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  limited: {
    id: 'limited',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  sale: {
    id: 'sale',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
};

export const MOCK_BADGE_TRANSLATIONS: ProductBadgeTranslation[] = [
  { badgeId: 'pre_order', languageCode: 'uk', label: 'Передзамовлення' },
  { badgeId: 'pre_order', languageCode: 'en', label: 'Pre-order' },
  { badgeId: 'new', languageCode: 'uk', label: 'Новинка' },
  { badgeId: 'new', languageCode: 'en', label: 'New' },
  { badgeId: 'most_popular', languageCode: 'uk', label: 'Хіт продажів' },
  { badgeId: 'most_popular', languageCode: 'en', label: 'Most popular' },
  { badgeId: 'bestseller', languageCode: 'uk', label: 'Бестселер' },
  { badgeId: 'bestseller', languageCode: 'en', label: 'Bestseller' },
  { badgeId: 'limited', languageCode: 'uk', label: 'Лімітована серія' },
  { badgeId: 'limited', languageCode: 'en', label: 'Limited' },
  { badgeId: 'sale', languageCode: 'uk', label: 'Знижка' },
  { badgeId: 'sale', languageCode: 'en', label: 'Sale' },
];
