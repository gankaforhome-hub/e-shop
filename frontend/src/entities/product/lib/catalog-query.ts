import { type SeasonSlug } from '@/entities/collection/seasons';
import {
  type CategorySlug,
  isCategorySlug,
  isProductSort,
  type ProductSort,
  type ProductsSearchParams,
} from '@/shared/config/routes';
import { parsePage } from '@/shared/lib/utils';

import {
  CUP_TYPES,
  BURN_TIMES_HOURS,
  CANDLE_SCENTS,
  COLOR_DECORATIONS,
  PLATE_DIAMETERS_CM,
  PLATE_SHAPES,
  PLATE_TYPES_1,
  PLATE_TYPES_2,
  isVariantAttributeKey,
  PRODUCT_ATTRIBUTE_FILTER_KEYS,
  PRODUCT_FEATURE_FLAGS,
  PRODUCT_MATERIALS,
  type ProductAttributeFilterKey,
  type ProductAttributeOption,
  type ProductAttributes,
  type ProductBaseAttributes,
  type ProductFeatureFlag,
  SERVES_COUNTS,
  SET_CONTENTS,
  SET_TYPES,
  VESSEL_MATERIALS,
  VOLUMES_ML,
  type VariantAttributes,
  WAX_TYPES,
} from '../model/attributes';

export type ProductAttributeFilters = {
  [K in ProductAttributeFilterKey]?: readonly ProductAttributeOption<K>[];
};

export type ProductFilters = {
  attributes: ProductAttributeFilters;
  features: readonly ProductFeatureFlag[];
  /** Collection slugs. */
  collections: readonly string[];
  /** Season slugs (dynamic entities, validated by shape only). */
  seasons: readonly SeasonSlug[];
  price: PriceBounds;
};

/** Inclusive UAH bounds; a missing side is open. */
export type PriceBounds = { min?: number; max?: number };

/** Fully validated catalog URL state. */
export type CatalogQuery = {
  category?: CategorySlug;
  search?: string;
  sort?: ProductSort;
  favoritesOnly: boolean;
  filters: ProductFilters;
  /** 1-based; never serialized by `serializeCatalogQuery` (changes reset it). */
  page: number;
};

export const EMPTY_FILTERS: ProductFilters = {
  attributes: {},
  features: [],
  collections: [],
  seasons: [],
  price: {},
};

/** URL parameter of one filter group. */
export type CatalogFilterParam =
  ProductAttributeFilterKey | 'features' | 'collection' | 'season';

/** URL params of the price range (`?minPrice=1900&maxPrice=5000`). */
export const PRICE_PARAMS = { min: 'minPrice', max: 'maxPrice' } as const;

type SearchParamsInput =
  URLSearchParams | Readonly<Record<string, string | string[] | undefined>>;

/** Multi-value params are comma-separated (`?material=porcelain,glass`). */
const VALUE_SEPARATOR = ',';
/** Shape guard for data-driven slugs (collections, seasons) the CMS may add. */
const SLUG_PATTERN = /^[a-z0-9_-]+$/;

function readValues(input: SearchParamsInput, key: string): string[] {
  const raw = input instanceof URLSearchParams ? input.getAll(key) : input[key];
  const list = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];

  return [
    ...new Set(
      list
        .flatMap(value => value.split(VALUE_SEPARATOR))
        .map(value => value.trim())
        .filter(Boolean),
    ),
  ];
}

function readFirst(input: SearchParamsInput, key: string): string | undefined {
  return readValues(input, key)[0];
}

/** Type guard via whitelist: keeps only allowed options, in canonical order. */
function pickAllowed<T extends string | number>(
  allowed: readonly T[],
  raw: readonly string[],
): T[] {
  return allowed.filter(option => raw.includes(String(option)));
}

function parseAttributeFilters(
  input: SearchParamsInput,
): ProductAttributeFilters {
  const read = (key: ProductAttributeFilterKey) => readValues(input, key);

  return {
    material: pickAllowed(PRODUCT_MATERIALS, read('material')),
    colorDecoration: pickAllowed(COLOR_DECORATIONS, read('colorDecoration')),
    plateType1: pickAllowed(PLATE_TYPES_1, read('plateType1')),
    plateType2: pickAllowed(PLATE_TYPES_2, read('plateType2')),
    shape: pickAllowed(PLATE_SHAPES, read('shape')),
    diameterCm: pickAllowed(PLATE_DIAMETERS_CM, read('diameterCm')),
    volumeMl: pickAllowed(VOLUMES_ML, read('volumeMl')),
    cupType: pickAllowed(CUP_TYPES, read('cupType')),
    servesCount: pickAllowed(SERVES_COUNTS, read('servesCount')),
    burnTimeHours: pickAllowed(BURN_TIMES_HOURS, read('burnTimeHours')),
    scent: pickAllowed(CANDLE_SCENTS, read('scent')),
    waxType: pickAllowed(WAX_TYPES, read('waxType')),
    vesselMaterial: pickAllowed(VESSEL_MATERIALS, read('vesselMaterial')),
    setType: pickAllowed(SET_TYPES, read('setType')),
    setContents: pickAllowed(SET_CONTENTS, read('setContents')),
  };
}

/** Non-negative whole UAH; anything else is dropped. */
function parsePrice(raw: string | undefined): number | undefined {
  const amount = Number(raw);
  return raw && Number.isSafeInteger(amount) && amount >= 0
    ? amount
    : undefined;
}

/** Drops missing sides and swaps reversed bounds (`min > max`). */
export function normalizePriceBounds(bounds: PriceBounds): PriceBounds {
  const { min, max } = bounds;
  if (min !== undefined && max !== undefined && min > max) {
    return { min: max, max: min };
  }
  return {
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
  };
}

/** Parses untrusted search params; unknown keys/values are dropped. */
export function parseCatalogQuery(input: SearchParamsInput): CatalogQuery {
  const category = readFirst(input, 'category');
  const sort = readFirst(input, 'sort');
  const search = readFirst(input, 'search');

  return {
    ...(isCategorySlug(category) && { category }),
    ...(isProductSort(sort) && { sort }),
    ...(search && { search }),
    favoritesOnly: readFirst(input, 'favoritesOnly') === 'true',
    page: parsePage(readFirst(input, 'page')),
    filters: {
      attributes: parseAttributeFilters(input),
      features: pickAllowed(
        PRODUCT_FEATURE_FLAGS,
        readValues(input, 'features'),
      ),
      collections: readValues(input, 'collection').filter(slug =>
        SLUG_PATTERN.test(slug),
      ),
      seasons: readValues(input, 'season').filter(slug =>
        SLUG_PATTERN.test(slug),
      ),
      price: normalizePriceBounds({
        min: parsePrice(readFirst(input, PRICE_PARAMS.min)),
        max: parsePrice(readFirst(input, PRICE_PARAMS.max)),
      }),
    },
  };
}

/** Selected values of one filter group as URL strings. */
export function getFilterValues(
  filters: ProductFilters,
  param: CatalogFilterParam,
): readonly string[] {
  switch (param) {
    case 'features':
      return filters.features;
    case 'collection':
      return filters.collections;
    case 'season':
      return filters.seasons;
    default: {
      const values: readonly (string | number)[] =
        filters.attributes[param] ?? [];
      return values.map(String);
    }
  }
}

export const CATALOG_FILTER_PARAMS: readonly CatalogFilterParam[] = [
  ...PRODUCT_ATTRIBUTE_FILTER_KEYS,
  'features',
  'collection',
  'season',
];

function serializeFilters(filters: ProductFilters): Record<string, string> {
  const entries = CATALOG_FILTER_PARAMS.map(
    param =>
      [param, getFilterValues(filters, param).join(VALUE_SEPARATOR)] as const,
  ).filter(([, value]) => value !== '');
  const { min, max } = filters.price;

  return {
    ...Object.fromEntries(entries),
    ...(min !== undefined && { [PRICE_PARAMS.min]: String(min) }),
    ...(max !== undefined && { [PRICE_PARAMS.max]: String(max) }),
  };
}

/** Typed `routes.products()` params; pagination resets on every change. */
export function serializeCatalogQuery(
  query: CatalogQuery,
): ProductsSearchParams {
  return {
    category: query.category,
    search: query.search,
    sort: query.sort,
    favoritesOnly: query.favoritesOnly ? 'true' : undefined,
    filters: serializeFilters(query.filters),
  };
}

/** Same query on another page; page 1 stays implicit (`/products`). */
export function serializeCatalogPage(
  query: CatalogQuery,
  page: number,
): ProductsSearchParams {
  return {
    ...serializeCatalogQuery(query),
    page: page > 1 ? String(page) : undefined,
  };
}

/** Replaces one group's values; the result is re-validated through the parser. */
export function setFilterValues(
  filters: ProductFilters,
  param: CatalogFilterParam,
  values: readonly string[],
): ProductFilters {
  const raw = new URLSearchParams(serializeFilters(filters));
  if (values.length) {
    raw.set(param, values.join(VALUE_SEPARATOR));
  } else {
    raw.delete(param);
  }

  return parseCatalogQuery(raw).filters;
}

/** Adds/removes one value of a group. */
export function toggleFilterValue(
  filters: ProductFilters,
  param: CatalogFilterParam,
  value: string,
): ProductFilters {
  const current = getFilterValues(filters, param);
  return setFilterValues(
    filters,
    param,
    current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value],
  );
}

/** Replaces the price range (normalized: open sides dropped, reversed swapped). */
export function setPriceBounds(
  filters: ProductFilters,
  bounds: PriceBounds,
): ProductFilters {
  return { ...filters, price: normalizePriceBounds(bounds) };
}

export function hasPriceBounds({ price }: ProductFilters): boolean {
  return price.min !== undefined || price.max !== undefined;
}

export function setCatalogSort(
  query: CatalogQuery,
  sort: ProductSort | undefined,
): CatalogQuery {
  const { sort: _previous, ...rest } = query;
  return sort ? { ...rest, sort } : rest;
}

/** Option values, plus one for a price range. */
export function countActiveFilters(filters: ProductFilters): number {
  return CATALOG_FILTER_PARAMS.reduce(
    (total, param) => total + getFilterValues(filters, param).length,
    hasPriceBounds(filters) ? 1 : 0,
  );
}

/* ------------------------------------------------------------------ */
/* Matching (shared by the DAL query and facet counts)                 */
/* ------------------------------------------------------------------ */

/** Minimal variant shape the matcher needs (the DAL passes full variants). */
export type FilterableVariant = {
  attributes: VariantAttributes;
  price: { amount: number };
};

export type FilterableProduct<V extends FilterableVariant> = {
  attributes: ProductBaseAttributes;
  collectionSlug: string;
  /** Inherited from the primary collection; absent = outside every season. */
  season?: SeasonSlug;
  variants: readonly V[];
};

/** Values of one attribute (arrays such as `setContents` flatten). */
export function getAttributeValues(
  attributes: ProductAttributes | undefined,
  key: ProductAttributeFilterKey,
): readonly (string | number)[] {
  const value: string | number | readonly (string | number)[] | undefined =
    attributes?.[key];
  if (value === undefined) {
    return [];
  }
  return typeof value === 'object' ? value : [value];
}

/**
 * Does the product carry `value` for `key`? Variant-level keys look across
 * every SKU, parent-level keys at the shared attributes.
 */
export function hasAttributeValue(
  product: FilterableProduct<FilterableVariant>,
  key: ProductAttributeFilterKey,
  value: string | number,
): boolean {
  return isVariantAttributeKey(key)
    ? product.variants.some(variant =>
        getAttributeValues(variant.attributes, key).includes(value),
      )
    : getAttributeValues(product.attributes, key).includes(value);
}

export function isInPriceBounds(price: number, bounds: PriceBounds): boolean {
  return (
    (bounds.min === undefined || price >= bounds.min) &&
    (bounds.max === undefined || price <= bounds.max)
  );
}

/**
 * Lowest and highest SKU price in `index`; `undefined` when nothing matches.
 * With `filters`, only SKUs matching them count, the price range itself
 * excluded (faceted bounds: the slider never shrinks to its own selection).
 */
export function getPriceExtent(
  index: readonly FilterableProduct<FilterableVariant>[],
  filters?: ProductFilters,
): { min: number; max: number } | undefined {
  const scope = filters && { ...filters, price: {} };
  const active = scope && getActiveSelections(scope);
  const prices = index.flatMap(product =>
    (scope
      ? getMatchingVariants(product, scope, active)
      : product.variants
    ).map(variant => variant.price.amount),
  );
  return prices.length > 0
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : undefined;
}

type ActiveSelection = {
  key: ProductAttributeFilterKey;
  values: readonly (string | number)[];
};

const matchesSelection = (
  attributes: ProductAttributes,
  { key, values }: ActiveSelection,
) => getAttributeValues(attributes, key).some(value => values.includes(value));

/** Attribute groups with at least one selected value, split by level. */
export function getActiveSelections(filters: ProductFilters) {
  const product: ActiveSelection[] = [];
  const variant: ActiveSelection[] = [];
  for (const key of PRODUCT_ATTRIBUTE_FILTER_KEYS) {
    const values: readonly (string | number)[] = filters.attributes[key] ?? [];
    if (values.length > 0) {
      (isVariantAttributeKey(key) ? variant : product).push({ key, values });
    }
  }
  return { product, variant };
}

/**
 * Variants satisfying the filters (empty → the product is filtered out).
 * OR within a group, AND across groups. Parent-level groups apply to the
 * product; variant-level groups and price must hold for the *same* SKU, so a
 * "27 cm" + "under 1000" query never matches a 23 cm plate at 900 and a 27 cm
 * one at 1500.
 */
export function getMatchingVariants<V extends FilterableVariant>(
  product: FilterableProduct<V>,
  filters: ProductFilters,
  // Callers matching many products against one filter set pass it precomputed
  active = getActiveSelections(filters),
): V[] {
  const productMatches =
    active.product.every(selection =>
      matchesSelection(product.attributes, selection),
    ) &&
    filters.features.every(flag => product.attributes[flag] === true) &&
    (filters.collections.length === 0 ||
      filters.collections.includes(product.collectionSlug)) &&
    (filters.seasons.length === 0 ||
      (product.season !== undefined &&
        filters.seasons.includes(product.season)));

  if (!productMatches) {
    return [];
  }
  const hasPrice = hasPriceBounds(filters);
  if (active.variant.length === 0 && !hasPrice) {
    return [...product.variants];
  }

  return product.variants.filter(
    variant =>
      active.variant.every(selection =>
        matchesSelection(variant.attributes, selection),
      ) &&
      (!hasPrice || isInPriceBounds(variant.price.amount, filters.price)),
  );
}

/* ------------------------------------------------------------------ */
/* Live counts (filter panel draft, server facets)                     */
/* ------------------------------------------------------------------ */

/**
 * Compact, serializable product shape the client counts against.
 * `categorySlug` lets the filter panel narrow by a draft category.
 */
export type CatalogIndexEntry = FilterableProduct<FilterableVariant> & {
  categorySlug: string;
};

/** Index entries (catalog cards) with at least one SKU matching `filters`. */
export function countMatchingProducts(
  index: readonly CatalogIndexEntry[],
  filters: ProductFilters,
): number {
  const active = getActiveSelections(filters);
  return index.reduce(
    (total, product) =>
      total +
      (getMatchingVariants(product, filters, active).length > 0 ? 1 : 0),
    0,
  );
}

/** `{ [param]: { [value]: count } }` for every option of the given groups. */
export type FacetCounts = Partial<
  Record<CatalogFilterParam, Readonly<Record<string, number>>>
>;

/**
 * Context-aware option counts: an option's count is the number of products
 * the query would return with that option selected and the rest of the active
 * filters kept, its own group excluded (standard faceted-search behaviour, so
 * siblings in one group never count each other down to zero). Ticking an
 * option with a non-zero count therefore never empties the result.
 */
export function getFacetCounts(
  index: readonly CatalogIndexEntry[],
  filters: ProductFilters,
  groups: readonly {
    param: CatalogFilterParam;
    values: readonly string[];
  }[],
): FacetCounts {
  return Object.fromEntries(
    groups.map(({ param, values }) => [
      param,
      Object.fromEntries(
        values.map(value => [
          value,
          countMatchingProducts(
            index,
            setFilterValues(filters, param, [value]),
          ),
        ]),
      ),
    ]),
  );
}
