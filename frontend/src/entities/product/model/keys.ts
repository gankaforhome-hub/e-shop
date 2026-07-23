import { type ProductBadge, type ProductStockStatus } from './types';

//INFO for translation
export const BADGE_TRANSLATION_KEYS: Record<ProductBadge, string> = {
  new: 'product.badges.new',
  top: 'product.badges.top',
  bestseller: 'product.badges.bestseller',
  pre_order: 'product.badges.preOrder',
  most_popular: 'product.badges.mostPopular',
  limited: 'product.badges.limited',
  sale: 'product.badges.sale',
};

export const STOCK_TRANSLATION_KEYS: Record<ProductStockStatus, string> = {
  in_stock: 'product.stock.inStock',
  low_stock: 'product.stock.lowStock',
  sold_out: 'product.stock.soldOut',
};

type lang = {
  product: {
    badges: Record<ProductBadge, string>;
    stock: Record<ProductStockStatus, string>;
  };
};

const ua: lang = {
  product: {
    badges: {
      new: 'новинка',
      top: 'топ',
      bestseller: 'хіт продажів',
      pre_order: 'передзамовлення',
      most_popular: 'найпопулярніше',
      limited: 'обмежена серія',
      sale: 'знижка',
    },
    stock: {
      in_stock: 'В наявності',
      low_stock: 'Мало залишилось',
      sold_out: 'Немає в наявності',
    },
  },
};

const en: lang = {
  product: {
    badges: {
      new: 'new',
      top: 'top',
      bestseller: 'best seller',
      pre_order: 'pre-order',
      most_popular: 'most popular',
      limited: 'limited',
      sale: 'sale',
    },
    stock: {
      in_stock: 'In stock',
      low_stock: 'Low stock',
      sold_out: 'sold out',
    },
  },
};

export type Locale = 'ua' | 'en';

const locales = {
  ua,
  en,
} as const;

function getLang(locale: Locale) {
  return locales[locale];
}

export function getBadgeLabel(locale: Locale, badge: ProductBadge) {
  const lang = getLang(locale);

  return lang.product.badges[badge];
}

export function getStockStatus(locale: Locale, badge: ProductStockStatus) {
  const lang = getLang(locale);

  return lang.product.stock[badge];
}
