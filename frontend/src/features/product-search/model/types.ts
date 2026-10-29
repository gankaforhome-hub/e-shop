import { type ProductCardDTO } from '@/entities/product/catalog';

/**
 * A collection whose name matches the query; it links to the collection page.
 * Categories and seasons are product attributes: they match products, not
 * shortcuts of their own.
 */
export type SearchSuggestion = { slug: string; label: string };

/** `GET /api/search` payload (`searchCatalog`). */
export type SearchResponse = {
  /** Best catalog cards (one per colour/glaze), most relevant first. */
  products: ProductCardDTO[];
  /** Matching collections, shown above the products. */
  suggestions: SearchSuggestion[];
  /** Every matching card: the "Show all" count, equal to `/products?search=`. */
  total: number;
};

/** Type-ahead state; `idle` until the query is long enough to search. */
export type SearchState =
  | { status: 'idle' }
  /** Debounce or request in flight; the previous results stay on screen. */
  | { status: 'loading'; data?: SearchResponse }
  | { status: 'success'; data: SearchResponse }
  | { status: 'error' };
