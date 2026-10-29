'use client';

import { useTranslations } from 'next-intl';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import {
  SEARCH_ROW_CLASS,
  SearchResultRow,
  SearchResultRowSkeleton,
} from './search-result-row';
import { isCollectionsQuery } from '../lib/collections-query';
import { type SearchResponse, type SearchState } from '../model/types';

const SKELETON_ROWS = 3;

const isEmpty = (data: SearchResponse) =>
  data.total === 0 && data.suggestions.length === 0;

interface SearchResultsProps {
  /** Current input; "Show all" and the empty message use it. */
  query: string;
  state: SearchState;
  /** Called when a link is followed (closes the popover or menu). */
  onNavigate: () => void;
  className?: string;
}

/**
 * Hint → skeleton → matching collections (direct links), product rows and
 * "Show all (N)". While a new query loads, the previous
 * results stay, dimmed.
 */
export function SearchResults({
  query,
  state,
  onNavigate,
  className,
}: SearchResultsProps) {
  const t = useTranslations('common.search');
  const data = state.status === 'success' ? state.data : undefined;
  const previous = state.status === 'loading' ? state.data : undefined;
  const shown = data ?? (previous && !isEmpty(previous) ? previous : undefined);

  const renderBody = () => {
    // "Collections" asks for the collections page itself: one link, no counts
    if (isCollectionsQuery(query)) {
      return (
        <AppLink
          href={routes.collections}
          onClick={onNavigate}
          data-search-nav
          className={cn(SEARCH_ROW_CLASS, 'justify-between py-3')}
        >
          <Text as="span" size="small" className="font-medium">
            {t('allCollections')}
          </Text>
          <Icon
            name="chevron-right"
            className="text-icon size-4"
            aria-hidden="true"
          />
        </AppLink>
      );
    }
    if (state.status === 'idle') {
      return (
        <Text size="small" variant="muted" className="px-4 py-4 lg:px-5">
          {t('hint')}
        </Text>
      );
    }
    if (state.status === 'error') {
      return (
        <Text size="small" variant="error" className="px-4 py-4 lg:px-5">
          {t('error')}
        </Text>
      );
    }
    if (!shown) {
      return (
        <div aria-hidden="true" className="py-2">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <SearchResultRowSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (isEmpty(shown)) {
      return (
        <Text size="small" variant="muted" className="px-4 py-4 lg:px-5">
          {t('empty', { query: query.trim() })}
        </Text>
      );
    }

    return (
      <div
        aria-busy={state.status === 'loading'}
        className={cn(
          'duration-(--dur-normal) transition-opacity',
          state.status === 'loading' && 'opacity-60',
        )}
      >
        {shown.suggestions.length > 0 && (
          <ul
            aria-label={t('suggestions')}
            className="border-border border-b py-2"
          >
            {shown.suggestions.map(suggestion => (
              <li key={suggestion.slug}>
                <AppLink
                  href={routes.collection(suggestion.slug)}
                  onClick={onNavigate}
                  data-search-nav
                  className={cn(SEARCH_ROW_CLASS, 'justify-between py-2.5')}
                >
                  <Text as="span" size="small" className="truncate">
                    {suggestion.label}
                  </Text>
                  <Text
                    as="span"
                    size="none"
                    variant="muted"
                    className="shrink-0 text-xs"
                  >
                    {t('collection')}
                  </Text>
                </AppLink>
              </li>
            ))}
          </ul>
        )}

        {shown.products.length > 0 && (
          <ul aria-label={t('products')} className="py-2">
            {shown.products.map(product => (
              <li key={product.variant.id}>
                <SearchResultRow product={product} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        )}

        {shown.total > 0 && (
          // Pinned to the bottom of a scrolling list; opaque fills on purpose
          <AppLink
            href={routes.products({ search: query.trim() })}
            onClick={onNavigate}
            data-search-nav
            className={cn(
              SEARCH_ROW_CLASS,
              'border-border bg-popover hover:bg-muted focus-visible:bg-muted sticky bottom-0 justify-between border-t py-3',
            )}
          >
            <Text as="span" size="small" className="font-medium">
              {t('viewAll', { count: shown.total })}
            </Text>
            <Icon
              name="chevron-right"
              className="text-icon size-4"
              aria-hidden="true"
            />
          </AppLink>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Announces the outcome once results settle */}
      <p role="status" className="sr-only">
        {data ? t('results', { count: data.total }) : ''}
      </p>
      {renderBody()}
    </div>
  );
}
