import 'server-only';

import { type Locale } from '@/shared/i18n/routing';
import { wait } from '@/shared/lib/utils';

import { getProducts } from './get-products';
import { parseProductSearchQuery } from '../lib/product-search';
import { type ProductCardDTO } from '../model/product-card.dto';

/** Simulated round trip of the database query (mock source only). */
const MOCK_LATENCY_MS = { min: 150, max: 450 } as const;

export type SearchProductsParams = {
  lang: Locale;
  /** Raw user input; too short (`parseProductSearchQuery`) → no results. */
  query: string;
  /** Cards to return, best first. */
  limit: number;
};

export type ProductSearchResult = {
  /** Catalog cards (one per colour/glaze), most relevant first. */
  items: ProductCardDTO[];
  /** Every matching card: `/products?search=` lists the same set. */
  total: number;
};

/**
 * Type-ahead product search: name, collection, category, season, colour or
 * SKU (`matchSearchCard`), ranked by relevance, then availability.
 *
 * Mock source: the cached in-memory catalog query behind a simulated network
 * delay. With Supabase, `getProducts` runs the full-text query (e.g. a
 * `search_products` RPC) and the delay goes; this signature and
 * `ProductSearchResult` stay.
 */
export async function searchProducts({
  lang,
  query,
  limit,
}: SearchProductsParams): Promise<ProductSearchResult> {
  const parsed = parseProductSearchQuery(query);
  if (!parsed) {
    return { items: [], total: 0 };
  }

  await wait(
    MOCK_LATENCY_MS.min +
      Math.random() * (MOCK_LATENCY_MS.max - MOCK_LATENCY_MS.min),
  );
  // Normalized words: "Plate" and "plate " share one cache entry
  const { data, meta } = await getProducts({
    lang,
    search: parsed.tokens.join(' '),
    limit,
  });
  return { items: data, total: meta.total };
}
