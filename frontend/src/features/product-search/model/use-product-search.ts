'use client';

import { useEffect, useRef, useState } from 'react';

import { useLocale } from 'next-intl';

import { parseProductSearchQuery } from '@/entities/product/catalog';
import { type Locale } from '@/shared/i18n/routing';

import { addRecentSearch } from './recent-searches';
import { type SearchResponse, type SearchState } from './types';
import { fetchSearchResults } from '../api/fetch-search-results';
import { isCollectionsQuery } from '../lib/collections-query';

/** Pause after the last keystroke before a request goes out. */
const SEARCH_DEBOUNCE_MS = 350;

/** Recent answers kept per query: backspacing shows them without a request. */
const MAX_CACHED_QUERIES = 20;

/**
 * Type-ahead product search: debounced `GET /api/search`, the previous
 * request aborted on every keystroke, recent answers reused. Requests start
 * from the change handler; the only effect cancels pending work on unmount.
 * `reset` clears the query and results (the panel closed); `saveRecentSearch` saves
 * a searchable query to the "Recent searches" history.
 */
export function useProductSearch() {
  const lang = useLocale() as Locale;
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const request = useRef<AbortController>(undefined);
  const answers = useRef(new Map<string, SearchResponse>());

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      request.current?.abort();
    },
    [],
  );

  const cacheAnswer = (key: string, data: SearchResponse) => {
    const cache = answers.current;
    cache.delete(key);
    cache.set(key, data);
    const oldest = cache.keys().next().value;
    if (cache.size > MAX_CACHED_QUERIES && oldest !== undefined) {
      cache.delete(oldest);
    }
  };

  const run = async (
    value: string,
    key: string,
  ): Promise<SearchResponse | undefined> => {
    const controller = new AbortController();
    request.current = controller;
    try {
      const data = await fetchSearchResults(value, lang, controller.signal);
      cacheAnswer(key, data);
      setState({ status: 'success', data });
      return data;
    } catch {
      // Aborted: a newer query took over and owns the state
      if (!controller.signal.aborted) {
        setState({ status: 'error' });
      }
      return undefined;
    }
  };

  const toKey = (tokens: readonly string[]) => `${lang}:${tokens.join(' ')}`;

  /** Keeps the current results (dimmed) while new ones load. */
  const startLoading = () =>
    setState(current => ({
      status: 'loading',
      ...(current.status !== 'idle' &&
        current.status !== 'error' &&
        current.data && { data: current.data }),
    }));

  const cancel = () => {
    clearTimeout(timer.current);
    request.current?.abort();
  };

  const reset = () => {
    cancel();
    setQuery('');
    setState({ status: 'idle' });
  };

  const saveRecentSearch = () => {
    if (parseProductSearchQuery(query)) {
      addRecentSearch(query);
    }
  };

  /**
   * Total matches of the current query, for Enter: the cached answer, or the
   * request sent right away (no debounce). `0` for a too-short query,
   * `undefined` when the search failed.
   */
  const resolveTotal = async (): Promise<number | undefined> => {
    const parsed = parseProductSearchQuery(query);
    if (!parsed) {
      return 0;
    }
    const key = toKey(parsed.tokens);
    const cached = answers.current.get(key);
    if (cached) {
      return cached.total;
    }
    cancel();
    startLoading();
    return (await run(query, key))?.total;
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    cancel();

    const parsed = parseProductSearchQuery(value);
    // The collections keyword is a link (`SearchResults`), not a search
    if (!parsed || isCollectionsQuery(value)) {
      setState({ status: 'idle' });
      return;
    }

    const key = toKey(parsed.tokens);
    const cached = answers.current.get(key);
    if (cached) {
      setState({ status: 'success', data: cached });
      return;
    }

    startLoading();
    timer.current = setTimeout(() => void run(value, key), SEARCH_DEBOUNCE_MS);
  };

  return {
    query,
    state,
    changeQuery,
    reset,
    saveRecentSearch,
    resolveTotal,
  };
}
