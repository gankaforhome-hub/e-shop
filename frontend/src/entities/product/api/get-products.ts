'use server';

import { cookies } from 'next/headers';

import { type Locale } from '@/shared/i18n/routing';

import {
  getMainVariant,
  mapProductToCard,
  STOCK_PRIORITY,
  type TProduct,
} from '../lib/product-mapper';
import { getProductsWithTranslation } from '../mock/products';
import { type ProductCardDTO } from '../model/product-card.dto';

export interface GetProductsParams {
  lang: Locale;
  limit?: number; // Кількість елементів на сторінку (наприклад, 12)
  page?: number; // Номер сторінки (1, 2, 3...)
  search?: string;
  category?: string;
  favoritesOnly?: string;
}

export interface PaginatedProductsDTO {
  data: ProductCardDTO[];
  meta: {
    total: number; // Всього товарів за цими фільтрами
    page: number; // Поточна сторінка
    limit: number; // Скільки товарів на сторінці
    totalPages: number; // Всього сторінок
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Повертаємо числовий пріоритет товару спираючись на статус головного варіанта
function getProductStockPriority(product: TProduct): number {
  const mainVariant = getMainVariant(product.variants);
  if (!mainVariant?.stock) {
    return STOCK_PRIORITY.out_of_stock;
  }

  // Оскільки status вже обчислений у normalizeProduct, просто витягуємо його ваговий пріоритет
  return (
    STOCK_PRIORITY[mainVariant.stock.status] ?? STOCK_PRIORITY.out_of_stock
  );
}

export async function getProducts(
  params: GetProductsParams,
): Promise<PaginatedProductsDTO> {
  const cookieStore = await cookies();
  const favoritesRaw = cookieStore.get('favorite_ids')?.value;

  let parsedFavorites: string[] = [];
  if (favoritesRaw) {
    try {
      parsedFavorites = JSON.parse(favoritesRaw);
    } catch {
      parsedFavorites = [];
    }
  }

  const favoriteIds = new Set<string>(parsedFavorites);

  // 1. Отримуємо нормалізовані TProduct[] (усі stock/options вже перекладені)
  let filtered = await getProductsWithTranslation(params.lang);

  // 2. Фільтрація за пошуковим запитом
  if (params.search) {
    const query = params.search.trim().toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  }

  // 3. Фільтрація за категорією
  if (params.category) {
    const categoryQuery = params.category.toLowerCase();
    filtered = filtered.filter(p => p.category.slug === categoryQuery);
  }

  // 4. Фільтр "Тільки обране"
  if (params.favoritesOnly === 'true') {
    filtered = filtered.filter(p => favoriteIds.has(p.id));
  }

  // 5. СОРТУВАННЯ: за пріоритетом стоку (в наявності -> закінчується -> передзамовлення -> немає)
  const sortedProducts = filtered
    .map(product => ({
      product,
      priority: getProductStockPriority(product),
    }))
    .sort((a, b) => a.priority - b.priority)
    .map(item => item.product);

  // 6. Розрахунок пагінації
  const total = sortedProducts.length;
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 12);
  const totalPages = Math.ceil(total / limit) || 1;

  const offset = (page - 1) * limit;
  const paginatedItems = sortedProducts.slice(offset, offset + limit);

  // 7. Формуємо підсумковий результат (mapProductToCard викликається ТІЛЬКИ для відфільтрованої сторінки)
  return {
    data: paginatedItems.map(product => ({
      ...mapProductToCard(product, params.lang),
      isFavorite: favoriteIds.has(product.id),
    })),
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getProductBySlug(
  productSlug: string,
  lang: Locale = 'uk',
): Promise<ProductCardDTO | null> {
  const products = await getProductsWithTranslation(lang);

  const product = products.find(product => product.slug === productSlug);

  if (!product) {
    return null;
  }

  return mapProductToCard(product, lang);
}
