import { apiRoutes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';

import { type SearchResponse } from '../model/types';

/** `GET /api/search`; rejects on HTTP errors and when `signal` aborts. */
export async function fetchSearchResults(
  query: string,
  lang: Locale,
  signal: AbortSignal,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ lang, q: query });
  const response = await fetch(`${apiRoutes.search}?${params.toString()}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Search request failed: ${response.status}`);
  }

  const data: SearchResponse = await response.json();
  return data;
}
