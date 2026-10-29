'use client';

import { useId } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { SEARCH_ROW_CLASS } from './search-result-row';
import {
  clearRecentSearches,
  removeRecentSearch,
  useRecentSearches,
} from '../model/recent-searches';

interface RecentSearchesProps {
  /** Runs the query again (fills the field). */
  onSelect: (query: string) => void;
  /**
   * `list` (desktop popover): rows with a per-item remove button.
   * `chips` (mobile menu): compact wrapping chips that leave room for the nav.
   */
  variant: 'list' | 'chips';
  className?: string;
}

/**
 * "Recent searches": the viewer's last queries, newest first. Shown only while
 * the search input of the enclosing `group/search` is focused (or focus is
 * inside the block itself, for keyboard users) — pure CSS, no focus state.
 */
export function RecentSearches({
  onSelect,
  variant,
  className,
}: RecentSearchesProps) {
  const t = useTranslations('common.search');
  const queries = useRecentSearches();
  const titleId = useId();

  if (queries.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby={titleId}
      // Pressing an item must not blur the input: that would hide the block
      // before the click lands (Safari doesn't focus buttons on click)
      onMouseDown={event => event.preventDefault()}
      className={cn(
        'hidden focus-within:block group-has-[input:focus]/search:block',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 lg:px-5">
        <Text
          as="span"
          size="none"
          variant="muted"
          id={titleId}
          className="text-xs font-medium uppercase tracking-wide"
        >
          {t('recent')}
        </Text>
        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={clearRecentSearches}
          className="text-muted-foreground hover:text-foreground-emphasis h-auto px-0 py-1 text-xs"
        >
          {t('recentClear')}
        </Button>
      </div>

      {variant === 'list' ? (
        <ul className="pt-1">
          {queries.map(query => (
            <li key={query} className="group/recent relative">
              <button
                type="button"
                onClick={() => onSelect(query)}
                data-search-nav
                className={cn(SEARCH_ROW_CLASS, 'py-2.5 pr-12 text-left')}
              >
                <Icon
                  name="history"
                  className="text-icon size-4 shrink-0"
                  aria-hidden="true"
                />
                <Text as="span" size="small" className="truncate">
                  {query}
                </Text>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRecentSearch(query)}
                aria-label={t('recentRemove', { query })}
                className={cn(
                  'text-muted-foreground hover:text-foreground-emphasis absolute right-2 top-1/2 -translate-y-1/2',
                  'duration-(--dur-fast) opacity-0 transition-opacity focus-visible:opacity-100 group-hover/recent:opacity-100',
                )}
              >
                <Icon name="close" className="size-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-wrap gap-2 px-4 pt-2">
          {queries.map(query => (
            <li key={query} className="min-w-0 max-w-full">
              <button
                type="button"
                onClick={() => onSelect(query)}
                data-search-nav
                className={cn(
                  'border-border text-foreground flex max-w-full items-center gap-1.5 border px-3 py-1.5',
                  'hover:bg-muted focus-visible:bg-muted duration-(--dur-fast) transition-colors',
                )}
              >
                <Icon
                  name="history"
                  className="text-icon size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <Text as="span" size="small" className="truncate">
                  {query}
                </Text>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
