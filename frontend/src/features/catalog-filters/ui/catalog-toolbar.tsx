'use client';

import { useTranslations } from 'next-intl';

import {
  type CatalogIndexEntry,
  setCatalogSort,
} from '@/entities/product/catalog';
import { scrollToTopIfHidden } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { FilterSheet } from './filter-sheet';
import { SortSelect } from './sort-select';
import { type CategoryFilterGroups, type CategoryOption } from '../model/types';
import { useCatalogQuery } from '../model/use-catalog-query';

interface CatalogToolbarProps {
  /** Filter panel groups per category. */
  groups: CategoryFilterGroups;
  /** Products matching the applied query (server count). */
  total: number;
  /** Compact search result (all categories) for live counts in the panel. */
  index: readonly CatalogIndexEntry[];
  /** Localized categories, selectable only inside the filter sheet. */
  categories: readonly CategoryOption[];
  /** `id` of the anchor above the toolbar that changes scroll back to. */
  scrollAnchorId: string;
}

function ProductsCount({
  total,
  isPending,
}: {
  total: number;
  isPending: boolean;
}) {
  const t = useTranslations('common.catalog.filters');

  return (
    <Text
      as="span"
      variant="muted"
      size="none"
      font="secondary"
      aria-live="polite"
      // Visible from `md`; below it stays for screen readers only
      className="relative whitespace-nowrap text-sm tabular-nums max-md:sr-only"
    >
      {t('productsCount', { count: total })}
      {/* Absolutely placed so the spinner never shifts the layout */}
      {isPending && (
        <Icon
          name="spinner"
          aria-hidden="true"
          className="absolute -right-6 top-1/2 size-4 -translate-y-1/2 animate-spin"
        />
      )}
    </Text>
  );
}

/**
 * Minimal bar: "Filter (N) · X products" · Sort from `md` (the page's only
 * product count); below `md` just Filter · Sort, and below 340px both
 * controls collapse to icons.
 * Categories and the selected-filter summary live only in the filter sheet. Static: it
 * scrolls away with the page. Every change resets to page 1 and, if the user
 * had scrolled past it, returns to `scrollAnchorId` (right above this bar).
 * Must render inside `<Suspense>` (reads `useSearchParams`).
 */
export function CatalogToolbar({
  groups,
  total,
  index,
  categories,
  scrollAnchorId,
}: CatalogToolbarProps) {
  const { query, isPending, navigate: navigateQuery } = useCatalogQuery();

  const navigate: typeof navigateQuery = next => {
    navigateQuery(next);
    scrollToTopIfHidden(document.getElementById(scrollAnchorId));
  };

  return (
    <div
      // `pt-1` keeps the buttons' focus rings inside the clipped box
      className="flex w-full items-center justify-between gap-2 overflow-hidden px-4 pb-3 pt-1 md:gap-4 md:pb-5"
      aria-busy={isPending}
      // Read by the catalog grid wrapper (`group-has-[[data-catalog-pending]]`)
      data-catalog-pending={isPending || undefined}
    >
      <div className="flex min-w-0 items-center gap-3">
        <FilterSheet
          groups={groups}
          categories={categories}
          category={query.category}
          filters={query.filters}
          onApply={draft => navigate({ ...query, ...draft })}
          isPending={isPending}
          index={index}
        />
        <Text
          as="span"
          variant="muted"
          size="none"
          aria-hidden="true"
          className="text-sm max-md:hidden"
        >
          ·
        </Text>
        <ProductsCount total={total} isPending={isPending} />
      </div>
      <SortSelect
        value={query.sort}
        onChange={sort => navigate(setCatalogSort(query, sort))}
      />
    </div>
  );
}
