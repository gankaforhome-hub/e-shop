import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { createTranslator } from 'next-intl';

import { getCategories } from '@/entities/category';
import { getCollections, getSeasons } from '@/entities/collection';
import { cacheTags } from '@/shared/config/cache-tags';
import { type ProductSort } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale, locales } from '@/shared/i18n/routing';

import { getAttributeLabels } from './get-attribute-labels';
import {
  type CatalogDict,
  createVariantAttributeDescriber,
  type FormatAttributeUnit,
} from '../lib/attribute-labels';
import {
  type FilterableProduct,
  getActiveSelections,
  getMatchingVariants,
  type ProductFilters,
} from '../lib/catalog-query';
import {
  getMainVariant,
  mapProductToCard,
  normalizeProduct,
  STOCK_PRIORITY,
} from '../lib/product-mapper';
import {
  type CardSearchTexts,
  matchSearchCard,
  parseProductSearchQuery,
  type ProductSearchHit,
  toCardSearchTexts,
} from '../lib/product-search';
import { getAppearanceSlices } from '../lib/variant-options';
import {
  MOCK_BADGE_TRANSLATIONS,
  MOCK_BADGES,
  MOCK_PRODUCT_TRANSLATIONS,
  MOCK_PRODUCTS,
} from '../mock/products';
import { type ProductCardDTO } from '../model/product-card.dto';
import {
  type LocalizedProduct,
  type LocalizedProductBadge,
  type ProductBadgeStatus,
  type ProductCategoryRef,
  type ProductCollectionRef,
  type ProductVariantTranslation,
} from '../model/types';

export type GetProductsParams = {
  lang: Locale;
  /** Items per page (e.g. 12). */
  limit?: number;
  /** 1-based page number. */
  page?: number;
  search?: string;
  category?: string;
  collectionSlug?: string;
  /** Restrict results to these product ids (e.g. the user's favorites). */
  ids?: readonly string[];
  /** Validated catalog filters (`parseCatalogQuery`). */
  filters?: ProductFilters;
  /** Omitted → recommended order (availability first). */
  sort?: ProductSort;
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
  cacheTag(
    cacheTags.products,
    cacheTags.categories,
    cacheTags.collections,
    cacheTags.attributes,
  );

  const [categories, collections, attributeLabels, { common }] =
    await Promise.all([
      getCategories(lang),
      getCollections(lang),
      getAttributeLabels(lang),
      getDictionary(['common'], lang),
    ]);

  // Variant attributes become localized options: names and enum values from
  // the translation tables, numbers through the UI unit templates (23 см)
  const dict: CatalogDict = common.catalog;
  const t = createTranslator({
    locale: lang,
    messages: { units: dict.units },
    namespace: 'units',
  });
  const formatUnit: FormatAttributeUnit = (key, value) => t(key, { value });
  const describeAttribute = createVariantAttributeDescriber(
    attributeLabels,
    formatUnit,
  );

  const translationsById = groupTranslationsBy(
    MOCK_PRODUCT_TRANSLATIONS,
    t => t.productId,
  );
  // Lean refs only: full DTOs (descriptions, SEO, media) would be copied into
  // every product and every cache entry built from it
  const categoriesById = new Map(
    categories.map((c): [string, ProductCategoryRef] => [
      c.id,
      { id: c.id, slug: c.slug, title: c.title },
    ]),
  );
  const collectionsBySlug = new Map(
    collections.map((c): [string, ProductCollectionRef] => [
      c.slug,
      {
        slug: c.slug,
        title: c.title,
        ...(c.season && { season: c.season }),
      },
    ]),
  );
  // Resolved once per locale and shared by every product that carries them
  const badgeLabels = groupTranslationsBy(
    MOCK_BADGE_TRANSLATIONS,
    t => t.badgeId,
  );
  const badgesById = new Map(
    Object.values(MOCK_BADGES).map(
      ({ id, color }): [ProductBadgeStatus, LocalizedProductBadge] => [
        id,
        {
          id,
          label: pickTranslation(badgeLabels.get(id) ?? [], lang)?.label ?? id,
          ...(color && { color }),
        },
      ],
    ),
  );

  return MOCK_PRODUCTS.map(product =>
    normalizeProduct(
      product,
      pickTranslation(translationsById.get(product.id) ?? [], lang),
      categoriesById.get(product.categoryId),
      collectionsBySlug.get(product.primaryCollectionSlug),
      product.badges.flatMap(id => badgesById.get(id) ?? []),
      lang,
      describeAttribute,
    ),
  );
}

/**
 * Shape consumed by the pure catalog matcher (`getMatchingVariants`): own
 * attributes plus the season slug inherited from the primary collection.
 */
export const toFilterableProduct = (
  product: LocalizedProduct,
): FilterableProduct<ProductVariantTranslation> => {
  const { season } = product.primaryCollection;
  return {
    attributes: product.attributes,
    collectionSlug: product.primaryCollection.slug,
    ...(season && { season }),
    variants: product.variants,
  };
};

/**
 * One catalog card before filtering: a product's colour/glaze slice (or the
 * whole product when it has no appearance choice), with its filter shape.
 */
export type CatalogItem = {
  product: LocalizedProduct;
  /** Colour/glaze label of the slice; absent for unsplit products. */
  label?: string;
  filterable: FilterableProduct<ProductVariantTranslation>;
  /** Relevance for `?search=`; set only by a search (`getCatalogItems`). */
  hit?: ProductSearchHit;
};

/** Products → cards: what the result list, its count and the facets count. */
export const toCatalogItems = (products: LocalizedProduct[]): CatalogItem[] =>
  products.flatMap(product => {
    const filterable = toFilterableProduct(product);
    return getAppearanceSlices(product.variants).map(({ label, variants }) => ({
      product,
      ...(label && { label }),
      filterable: { ...filterable, variants },
    }));
  });

/** A card in the result list with the SKU it should show. */
type CatalogEntry = {
  product: LocalizedProduct;
  variant: ProductVariantTranslation | undefined;
  label?: string;
  /** Search relevance (`?search=`): the default order puts it first. */
  score?: number;
};

/** Category/collection/ids narrowing shared by `getProducts` and facet counts. */
export function filterProductsBase(
  products: LocalizedProduct[],
  params: Pick<GetProductsParams, 'category' | 'collectionSlug' | 'ids'>,
): LocalizedProduct[] {
  let filtered = products;

  if (params.category) {
    const categoryQuery = params.category.toLowerCase();
    filtered = filtered.filter(p => p.category.slug === categoryQuery);
  }

  if (params.collectionSlug) {
    filtered = filtered.filter(
      p => p.primaryCollectionSlug === params.collectionSlug,
    );
  }

  if (params.ids) {
    const ids = new Set(params.ids);
    filtered = filtered.filter(p => ids.has(p.id));
  }

  return filtered;
}

/** Identifies a card across locales: same product, same colour/glaze slice. */
const cardKey = ({ product, filterable }: CatalogItem) =>
  `${product.id}:${filterable.variants[0]?.id ?? ''}`;

/** Every card's search words in `lang` (cards built exactly as the catalog's). */
async function getCardSearchTexts(
  lang: Locale,
  params: Pick<GetProductsParams, 'category' | 'collectionSlug' | 'ids'>,
): Promise<Map<string, CardSearchTexts>> {
  const [products, seasons] = await Promise.all([
    getLocalizedProducts(lang),
    getSeasons(lang),
  ]);
  const seasonLabels = new Map(seasons.map(({ slug, label }) => [slug, label]));
  return new Map(
    toCatalogItems(filterProductsBase(products, params)).map(item => {
      const { season } = item.product.primaryCollection;
      return [
        cardKey(item),
        toCardSearchTexts(item, season ? seasonLabels.get(season) : undefined),
      ];
    }),
  );
}

/**
 * Catalog cards in scope: category/collection/ids, then `?search=` per card
 * (`matchSearchCard`: name, collection, category, season, colour in every
 * locale, SKU), so the result list, its total, the facets and the header
 * search agree.
 */
export async function getCatalogItems(
  params: Pick<
    GetProductsParams,
    'lang' | 'search' | 'category' | 'collectionSlug' | 'ids'
  >,
): Promise<CatalogItem[]> {
  const items = toCatalogItems(
    filterProductsBase(await getLocalizedProducts(params.lang), params),
  );
  const query = parseProductSearchQuery(params.search);
  if (!query) {
    return items;
  }

  // Current locale first: its words decide the title-prefix bonus too
  const textsByLocale = await Promise.all(
    [params.lang, ...locales.filter(locale => locale !== params.lang)].map(
      locale => getCardSearchTexts(locale, params),
    ),
  );
  return items.flatMap(item => {
    const key = cardKey(item);
    const texts = textsByLocale.flatMap(byCard => byCard.get(key) ?? []);
    const hit = matchSearchCard(item, query, texts);
    return hit ? [{ ...item, hit }] : [];
  });
}

const entryPrice = (entry: CatalogEntry) => entry.variant?.price.amount ?? 0;

/** 1 when the shown variant can't be bought (or there is none), else 0. */
const isSoldOut = (entry: CatalogEntry) =>
  entry.variant?.stock.status === 'out_of_stock' || !entry.variant ? 1 : 0;

/** Stock priority of the shown variant (in stock → … → out of stock). */
const entryStockPriority = (entry: CatalogEntry) =>
  entry.variant
    ? STOCK_PRIORITY[entry.variant.stock.status]
    : STOCK_PRIORITY.out_of_stock;

function sortEntries(
  entries: CatalogEntry[],
  sort: ProductSort | undefined,
): CatalogEntry[] {
  const compare: Record<
    ProductSort,
    (a: CatalogEntry, b: CatalogEntry) => number
  > = {
    price_asc: (a, b) => entryPrice(a) - entryPrice(b),
    price_desc: (a, b) => entryPrice(b) - entryPrice(a),
    // ISO dates compare lexicographically; undated products go last
    newest: (a, b) =>
      (b.product.createdAt ?? '').localeCompare(a.product.createdAt ?? ''),
  };

  // Default: search relevance (only with `?search=`), then in stock -> low
  // stock -> pre-order -> out of stock. An explicit order (price, newest)
  // applies within two tiers: purchasable first, sold out last. Sorts are
  // stable, so ties keep the catalog order.
  return entries.toSorted(
    sort
      ? (a, b) => isSoldOut(a) - isSoldOut(b) || compare[sort](a, b)
      : (a, b) =>
          (b.score ?? 0) - (a.score ?? 0) ||
          entryStockPriority(a) - entryStockPriority(b),
  );
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
  cacheTag(cacheTags.products, cacheTags.seasons);

  const { filters } = params;
  const active = filters && getActiveSelections(filters);
  // One card per colour/glaze; variant-level filters pick the SKU it opens
  // with inside its slice (e.g. the 27 cm plate in yellow), and so does a
  // searched SKU when the filters allow it
  const entries = (await getCatalogItems(params)).flatMap(
    ({ product, label, filterable, hit }): CatalogEntry[] => {
      const entry = (variant: ProductVariantTranslation | undefined) => ({
        product,
        variant,
        ...(label && { label }),
        ...(hit && { score: hit.score }),
      });
      const searched = hit?.variant;
      if (!filters) {
        return [entry(searched ?? getMainVariant(filterable.variants))];
      }
      const matching = getMatchingVariants(filterable, filters, active);
      if (matching.length === 0) {
        return [];
      }
      return [
        entry(
          searched && matching.includes(searched)
            ? searched
            : getMainVariant(matching),
        ),
      ];
    },
  );

  const sortedEntries = sortEntries(entries, params.sort);

  const total = sortedEntries.length;
  const limit = Math.max(1, params.limit ?? 12);
  const totalPages = Math.ceil(total / limit) || 1;
  // Out-of-range pages (stale links, `?page=99`) show the last page
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);
  const offset = (page - 1) * limit;

  return {
    data: sortedEntries
      .slice(offset, offset + limit)
      .map(({ product, variant, label }) =>
        mapProductToCard(product, variant, label),
      ),
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
