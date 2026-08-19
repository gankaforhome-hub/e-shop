import { type Category, type CategoryTranslation } from '../model/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    slug: 'plates',
    image: {
      src: '/images/category/cat-plates.webp',
      alt: 'Ceramic plates',
    },
    productsCount: 12,
  },
  {
    id: 'cat-2',
    slug: 'sets',
    image: {
      id: 'cat-sets',
      src: '/images/category/cat-sets.webp',
      alt: 'Dinnerware sets',
    },
    productsCount: 4,
  },
  {
    id: 'cat-3',
    slug: 'kettles',
    image: {
      src: '/images/category/cat-kettles.webp',
      alt: 'Ceramic kettles',
    },
    productsCount: 5,
  },
  {
    id: 'cat-4',
    slug: 'cups',
    image: {
      src: '/images/category/cat-cups.webp',
      alt: 'Ceramic cups',
    },
    productsCount: 18,
  },
  {
    id: 'cat-5',
    slug: 'candlesticks',
    image: {
      id: 'cat-candlesticks',
      src: '/images/category/cat-candlesticks.webp',
      alt: 'Ceramic candlesticks',
    },
    productsCount: 7,
  },
  {
    id: 'cat-6',
    slug: 'glass',
    image: {
      src: '/images/category/cat-glass.webp',
      alt: 'Glass collection',
    },
    productsCount: 9,
  },
];

export const mockCategoriesTranslations: CategoryTranslation[] = [
  {
    categoryId: 'cat-1',
    languageCode: 'en',
    title: 'Plates',
    description: "Large and dessert plates with author's ceramics",
  },
  {
    categoryId: 'cat-2',
    languageCode: 'en',
    title: 'Sets',
    description: 'Ready sets for serving the table',
  },
  {
    categoryId: 'cat-3',
    languageCode: 'en',
    title: 'Kettles',
    description: 'Ceramic and glass teapots for brewing',
  },
  {
    categoryId: 'cat-4',
    languageCode: 'en',
    title: 'Cups',
    description: 'Cozy cups for tea, coffee and morning rituals',
  },
  {
    categoryId: 'cat-5',
    languageCode: 'en',
    title: 'Candlesticks',
    description: 'Decorative candlesticks for atmospheric evenings',
  },
  {
    categoryId: 'cat-6',
    languageCode: 'en',
    title: 'Glass',
    description: 'Elegant glassware for drinks and cocktails',
  },
  {
    categoryId: 'cat-1',
    languageCode: 'uk',
    title: 'Тарілки',
    description: 'Великі та десертні тарілки з авторської кераміки',
  },
  {
    categoryId: 'cat-2',
    languageCode: 'uk',
    title: 'Набори',
    description: 'Готові набори для сервірування столу',
  },
  {
    categoryId: 'cat-3',
    languageCode: 'uk',
    title: 'Чайники',
    description: 'Керамічні та скляні чайники для заварювання',
  },
  {
    categoryId: 'cat-4',
    languageCode: 'uk',
    title: 'Чашки',
    description: 'Затишні чашки для чаю, кави та ранкових ритуалів',
  },
  {
    categoryId: 'cat-5',
    languageCode: 'uk',
    title: 'Підсвічники',
    description: 'Декоративні підсвічники для атмосферних вечорів',
  },
  {
    categoryId: 'cat-6',
    languageCode: 'uk',
    title: 'Склянки',
    description: 'Елегантний скляний посуд для напоїв та коктейлів',
  },
];
