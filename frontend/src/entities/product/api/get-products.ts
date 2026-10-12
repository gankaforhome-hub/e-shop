import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { getCategories } from '@/entities/category';
import { getCollections } from '@/entities/collection';
import { cacheTags } from '@/shared/config/cache-tags';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';

import {
  getMainVariant,
  mapProductToCard,
  normalizeProduct,
  STOCK_PRIORITY,
} from '../lib/product-mapper';
import {
  MOCK_BADGES,
  MOCK_PRODUCT_TRANSLATIONS,
  MOCK_PRODUCTS,
} from '../mock/products';
import { type ProductCardDTO } from '../model/product-card.dto';
import {
  type LocalizedProduct,
  type ProductBadgeTranslation,
} from '../model/types';

export type GetProductsParams = {
  lang: Locale;
  /** Items per page (e.g. 12). */
  limit?: number;
  /** 1-based page number. */
  page?: number;
  search?: string;
  category?: string;
  collectionId?: string;
  /** Restrict results to these product ids (e.g. the user's favorites). */
  ids?: readonly string[];
};

export type PaginatedProductsDTO = {
  data: ProductCardDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

/**
 * Resolves every product for `lang`: joins translations (with default-locale
 * fallback), category/collection refs and localized badges.
 */
export async function getLocalizedProducts(
  lang: Locale,
): Promise<LocalizedProduct[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.products, cacheTags.categories, cacheTags.collections);

  const [categories, collections] = await Promise.all([
    getCategories(lang),
    getCollections(lang),
  ]);

  const translationsById = groupTranslationsBy(
    MOCK_PRODUCT_TRANSLATIONS,
    t => t.productId,
  );
  const categoriesById = new Map(categories.map(c => [c.id, c]));
  const collectionsById = new Map(collections.map(c => [c.id, c]));

  return MOCK_PRODUCTS.map(product => {
    const badges: ProductBadgeTranslation[] = product.badges.map(badgeId => {
      const badge = MOCK_BADGES[badgeId];
      return {
        id: badgeId,
        label: badge.translations[lang] || badgeId,
        ...(badge.color && { color: badge.color }),
      };
    });

    return normalizeProduct(
      product,
      pickTranslation(translationsById.get(product.id) ?? [], lang),
      categoriesById.get(product.categoryId),
      collectionsById.get(product.primaryCollectionId),
      badges,
      lang,
    );
  });
}

/** Numeric stock priority of a product, based on its main variant. */
function getProductStockPriority(product: LocalizedProduct): number {
  const mainVariant = getMainVariant(product.variants);
  if (!mainVariant) {
    return STOCK_PRIORITY.out_of_stock;
  }
  return STOCK_PRIORITY[mainVariant.stock.status];
}

/**
 * Catalog query: filters, sorts by availability and paginates.
 * Returns user-agnostic cards (`isFavorite: false`); callers merge per-user state.
 */
export async function getProducts(
  params: GetProductsParams,
): Promise<PaginatedProductsDTO> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.products);

  let filtered = await getLocalizedProducts(params.lang);

  const query = params.search?.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  }

  if (params.category) {
    const categoryQuery = params.category.toLowerCase();
    filtered = filtered.filter(p => p.category.slug === categoryQuery);
  }

  if (params.collectionId) {
    filtered = filtered.filter(
      p => p.primaryCollectionId === params.collectionId,
    );
  }

  if (params.ids) {
    const ids = new Set(params.ids);
    filtered = filtered.filter(p => ids.has(p.id));
  }

  // In stock -> low stock -> pre-order -> out of stock (stable sort)
  const sortedProducts = filtered
    .map(product => ({ product, priority: getProductStockPriority(product) }))
    .sort((a, b) => a.priority - b.priority)
    .map(item => item.product);

  const total = sortedProducts.length;
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 12);
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;

  return {
    data: sortedProducts.slice(offset, offset + limit).map(mapProductToCard),
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
  lang: Locale,
): Promise<LocalizedProduct | null> {
  'use cache';
  cacheLife('hours');

  const products = await getLocalizedProducts(lang);
  const product = products.find(p => p.slug === productSlug) ?? null;
  cacheTag(
    cacheTags.products,
    ...(product ? [cacheTags.product(product.id)] : []),
  );
  return product;
}
