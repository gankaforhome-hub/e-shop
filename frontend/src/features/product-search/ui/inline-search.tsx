'use client';

import { useRef } from 'react';

import { RecentSearches } from './recent-searches';
import { SearchForm } from './search-form';
import { SearchResults } from './search-results';
import { moveSearchFocus } from '../lib/move-search-focus';
import { useProductSearch } from '../model/use-product-search';

interface InlineSearchProps {
  /** Called when a link is followed (closes the menu). */
  onNavigate: () => void;
}

/**
 * Search as its own view (mobile menu → "Search"): the field on top (focused
 * on open), the recent searches while it is focused, then the hint or the
 * live results. Fills its flex parent; the area under the field scrolls. The
 * state lives with the component, so leaving the view or closing the menu
 * (unmount) clears the query and the results.
 */
export function InlineSearch({ onNavigate }: InlineSearchProps) {
  const { query, state, changeQuery, saveRecentSearch, resolveTotal } =
    useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = () => {
    saveRecentSearch();
    onNavigate();
  };

  const selectRecent = (value: string) => {
    changeQuery(value);
    inputRef.current?.focus();
  };

  return (
    <div
      className="group/search flex min-h-0 flex-1 flex-col"
      onKeyDown={moveSearchFocus}
    >
      <div className="border-muted shrink-0 border-b px-4 py-3">
        <SearchForm
          query={query}
          isLoading={state.status === 'loading'}
          onQueryChange={changeQuery}
          resolveTotal={resolveTotal}
          onNavigate={navigate}
          inputRef={inputRef}
          autoFocus
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {!query.trim() && (
          <RecentSearches
            variant="chips"
            onSelect={selectRecent}
            className="border-muted shrink-0 border-b pb-4 pt-3"
          />
        )}
        <SearchResults query={query} state={state} onNavigate={navigate} />
      </div>
    </div>
  );
}
