import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { getCollections, getSeasons } from '@/entities/collection';
import { cacheTags } from '@/shared/config/cache-tags';
import { type CategorySlug } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { compareSortOrder } from '@/shared/lib/utils';

import { getAttributeLabels } from './get-attribute-labels';
import {
  filterProductsBase,
  getLocalizedProducts,
  toFilterableProduct,
} from './get-products';
import {
  getFeatureFlagsFor,
  getAttributeFiltersFor,
  PRICE_RANGES,
} from '../config/catalog-filters';
import {
  type CatalogFilterParam,
  type CatalogIndexEntry,
  hasAttributeValue,
  isInPriceRange,
} from '../lib/catalog-query';
import {
  PRODUCT_ATTRIBUTE_OPTIONS,
  type ProductAttributeFilterKey,
} from '../model/attributes';

export type CatalogFacetOption = {
  /** URL value (attribute key, flag, collection slug or price range). */
  value: string;
  /** Products in the current category/search that match this value. */
  count: number;
  /**
   * Localized label from the translation tables (attribute values, features,
   * collection titles, seasons). Omitted for UI-formatted values: numeric
   * attributes (unit templates) and price ranges (UI dictionary).
   */
  label?: string;
};

export type CatalogFacetGroup = {
  param: CatalogFilterParam;
  /** Attribute name from `attribute_translations`; UI groups (collection, features, price) omit it. */
  label?: string;
  options: CatalogFacetOption[];
};

export type GetCatalogFacetsParams = {
  lang: Locale;
  category?: CategorySlug;
  search?: string;
  ids?: readonly string[];
};

/**
 * Panel order (top → bottom): collections · seasons & themes · material ·
 * colour/decoration · category-specific attributes (plate type, diameter,
 * volume, burn time, set type…) in `CATEGORY_ATTRIBUTE_FILTERS` order ·
 * usage features (dishwasher/microwave) · price.
 */
const SHARED_ATTRIBUTE_GROUPS = [
  'material',
  'colorDecoration',
] as const satisfies readonly ProductAttributeFilterKey[];

const withProducts = (options: CatalogFacetOption[]) =>
  options.filter(option => option.count > 0);

function countBy<T>(items: readonly T[], predicate: (item: T) => boolean) {
  return items.reduce((total, item) => total + (predicate(item) ? 1 : 0), 0);
}

/**
 * Locale-aware alphabetical order for text options (materials, decorations,
 * plate types, features…). Numeric options have no label and keep their
 * ascending tuple order.
 */
const sortByLabel = (
  options: CatalogFacetOption[],
  compare: Intl.Collator['compare'],
) =>
  options.every(option => option.label)
    ? options.toSorted((a, b) => compare(a.label ?? '', b.label ?? ''))
    : options;

/**
 * Filter groups for the catalog panel, in the order documented on
 * `SHARED_ATTRIBUTE_GROUPS`. Counts are products in the category/search
 * result; variant-level values (diameter, volume…) and price count a product
 * once if any of its SKUs has them. Empty values are omitted.
 */
export async function getCatalogFacets(
  params: GetCatalogFacetsParams,
): Promise<CatalogFacetGroup[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(
    cacheTags.products,
    cacheTags.collections,
    cacheTags.seasons,
    cacheTags.attributes,
  );

  const [localized, labels, seasons, allCollections] = await Promise.all([
    getLocalizedProducts(params.lang),
    getAttributeLabels(params.lang),
    getSeasons(params.lang),
    getCollections(params.lang),
  ]);
  const products = filterProductsBase(localized, params);
  // Built once: every attribute option is counted against the same shapes
  const filterables = products.map(toFilterableProduct);
  const { compare } = new Intl.Collator(params.lang);

  const attributeGroup = (
    key: ProductAttributeFilterKey,
  ): CatalogFacetGroup => {
    const allowed: readonly (string | number)[] =
      PRODUCT_ATTRIBUTE_OPTIONS[key];
    const valueLabels = labels.values[key];
    return {
      param: key,
      label: labels.names[key] ?? key,
      options: sortByLabel(
        withProducts(
          allowed.map(value => {
            const label =
              typeof value === 'string' ? valueLabels?.[value] : undefined;
            return {
              value: String(value),
              count: countBy(filterables, p =>
                hasAttributeValue(p, key, value),
              ),
              ...(label && { label }),
            };
          }),
        ),
        compare,
      ),
    };
  };

  const featureGroup: CatalogFacetGroup = {
    param: 'features',
    options: sortByLabel(
      withProducts(
        getFeatureFlagsFor(params.category).map(flag => ({
          value: flag,
          label: labels.names[flag] ?? flag,
          count: countBy(products, p => p.attributes[flag] === true),
        })),
      ),
      compare,
    ),
  };

  // One pass for both groups. Seasons are aggregated from the collections in
  // the result, never from a fixed list: a collection without a season stays
  // out of the group, and a CMS season appears once a collection uses it
  const collectionCounts = new Map<string, number>();
  const seasonCounts = new Map<string, number>();
  const increment = (counts: Map<string, number>, key: string) =>
    counts.set(key, (counts.get(key) ?? 0) + 1);
  for (const { primaryCollection } of products) {
    if (primaryCollection.slug) {
      increment(collectionCounts, primaryCollection.slug);
    }
    if (primaryCollection.season) {
      increment(seasonCounts, primaryCollection.season);
    }
  }

  // CMS priority (`sortOrder` ascending) first; equal or missing priority
  // falls back to the localized title. Unprioritized collections go last.
  const collectionGroup: CatalogFacetGroup = {
    param: 'collection',
    options: allCollections
      .filter(collection => collectionCounts.has(collection.slug))
      .toSorted((a, b) => compareSortOrder(a, b) || compare(a.title, b.title))
      .map(collection => ({
        value: collection.slug,
        label: collection.title,
        count: collectionCounts.get(collection.slug) ?? 0,
      })),
  };

  // `getSeasons` is already in `sortOrder`; slugs without a season row
  // (stale CMS references) go last under their raw slug
  const knownSeasons = new Set(seasons.map(season => season.slug));
  const seasonGroup: CatalogFacetGroup = {
    param: 'season',
    options: [
      ...seasons.flatMap(({ slug, label }) => {
        const count = seasonCounts.get(slug);
        return count ? [{ value: slug, label, count }] : [];
      }),
      ...[...seasonCounts]
        .filter(([slug]) => !knownSeasons.has(slug))
        .map(([slug, count]) => ({ value: slug, label: slug, count })),
    ],
  };

  const priceGroup: CatalogFacetGroup = {
    param: 'price',
    options: withProducts(
      PRICE_RANGES.map(range => ({
        value: range,
        count: countBy(products, p =>
          p.variants.some(v => isInPriceRange(v.price.amount, range)),
        ),
      })),
    ),
  };

  // Shared groups lead only when the category offers them (candles don't)
  const categoryKeys = getAttributeFiltersFor(params.category);
  const isShared = (key: ProductAttributeFilterKey) =>
    SHARED_ATTRIBUTE_GROUPS.some(shared => shared === key);

  return [
    collectionGroup,
    seasonGroup,
    ...SHARED_ATTRIBUTE_GROUPS.filter(key => categoryKeys.includes(key)).map(
      attributeGroup,
    ),
    ...categoryKeys.filter(key => !isShared(key)).map(attributeGroup),
    featureGroup,
    priceGroup,
  ].filter(group => group.options.length > 0);
}

/**
 * Compact filter index of the category/search result (attributes, collection,
 * SKU attributes + prices only). The filter panel counts its draft against it
 * client-side, so option counts and "Show N products" update instantly.
 */
export async function getCatalogIndex(
  params: GetCatalogFacetsParams,
): Promise<CatalogIndexEntry[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(cacheTags.products, cacheTags.collections);

  return filterProductsBase(
    await getLocalizedProducts(params.lang),
    params,
  ).map(product => {
    const { attributes, collectionSlug, season, variants } =
      toFilterableProduct(product);
    return {
      attributes,
      collectionSlug,
      ...(season && { season }),
      // Only what the matcher reads, to keep the client payload small
      variants: variants.map(variant => ({
        attributes: variant.attributes,
        price: { amount: variant.price.amount },
      })),
    };
  });
}
