/**
 * Client-safe catalog API (no `server-only` DAL): filter attributes, URL query
 * parsing/serialization and label resolution. Server reads live in `./index`.
 */
export { CATALOG_PAGE_SIZE } from './config/catalog-filters';
export {
  CATALOG_FILTER_PARAMS,
  type CatalogFilterParam,
  type CatalogIndexEntry,
  type CatalogQuery,
  countActiveFilters,
  countMatchingProducts,
  EMPTY_FILTERS,
  type FacetCounts,
  getFacetCounts,
  getFilterValues,
  getPriceExtent,
  hasPriceBounds,
  parseCatalogQuery,
  PRICE_PARAMS,
  type PriceBounds,
  type ProductFilters,
  serializeCatalogPage,
  serializeCatalogQuery,
  setCatalogSort,
  setPriceBounds,
  toggleFilterValue,
} from './lib/catalog-query';
export {
  type CatalogDict,
  formatFilterOptionLabel,
  type FormatAttributeUnit,
  isUiFilterGroup,
} from './lib/attribute-labels';
export {
  type NumericAttributeFilterKey,
  PRODUCT_ATTRIBUTE_OPTIONS,
  type ProductFeatureFlag,
  type ProductAttributeFilterKey,
  type ProductAttributes,
} from './model/attributes';
