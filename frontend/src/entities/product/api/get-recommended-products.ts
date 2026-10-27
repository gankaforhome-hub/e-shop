import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { getLocalizedProducts } from './get-products';
import {
  getMainVariant,
  mapProductToCard,
  STOCK_PRIORITY,
} from '../lib/product-mapper';
import { getAppearanceSlices } from '../lib/variant-options';
import { type ProductCardDTO } from '../model/product-card.dto';
import { type LocalizedProduct } from '../model/types';

/**
 * `collection`: same primary collection only; `related`: everything else
 * (same category first, then the rest); `all`: both, collection first.
 */
export type RecommendationGroup = 'collection' | 'related' | 'all';

export type GetRecommendedProductsParams = {
  /** The product being viewed; never recommended to itself. */
  productId: string;
  lang: Locale;
  group?: RecommendationGroup;
  limit?: number;
};

const isInGroup = (relevance: number, group: RecommendationGroup) =>
  group === 'all' || (group === 'collection') === (relevance === 0);

/** Relevance tier: same collection → same category → everything else. */
const getRelevance = (
  candidate: LocalizedProduct,
  source: LocalizedProduct,
) => {
  if (candidate.primaryCollectionId === source.primaryCollectionId) {
    return 0;
  }
  return candidate.category.id === source.category.id ? 1 : 2;
};

/** Catalog card of a product: its first colour/glaze slice, as in the catalog. */
const toRecommendationCard = (product: LocalizedProduct): ProductCardDTO => {
  const [slice] = getAppearanceSlices(product.variants);
  return mapProductToCard(
    product,
    getMainVariant(slice?.variants ?? product.variants),
    slice?.label,
  );
};

/** Stock priority of the card's SKU (in stock first, sold out last). */
const cardStockPriority = (card: ProductCardDTO) =>
  STOCK_PRIORITY[card.variant.stock.status];

/**
 * Recommended products for a PDP: one card per product, ranked by relevance
 * tier, then availability (stable within a tier, so catalog order breaks ties).
 *
 * The single data entry point for recommendations: swap the body for an API
 * call (e.g. `GET /products/:id/recommendations`) and keep the signature —
 * the UI only consumes `ProductCardDTO[]`. Returns user-agnostic cards
 * (`isFavorite: false`); callers merge per-user state.
 */
export async function getRecommendedProducts({
  productId,
  lang,
  group = 'all',
  limit = 4,
}: GetRecommendedProductsParams): Promise<ProductCardDTO[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.products);

  const products = await getLocalizedProducts(lang);
  const source = products.find(p => p.id === productId);
  if (!source) {
    return [];
  }

  return products
    .filter(p => p.id !== productId)
    .map(product => ({
      relevance: getRelevance(product, source),
      product,
    }))
    .filter(({ relevance }) => isInGroup(relevance, group))
    .map(({ relevance, product }) => ({
      relevance,
      card: toRecommendationCard(product),
    }))
    .toSorted(
      (a, b) =>
        a.relevance - b.relevance ||
        cardStockPriority(a.card) - cardStockPriority(b.card),
    )
    .slice(0, Math.max(0, limit))
    .map(({ card }) => card);
}
