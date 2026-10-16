'use client';

import { type ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import {
  type CatalogIndexEntry,
  EMPTY_FILTERS,
  setCatalogSort,
  toggleFilterValue,
} from '@/entities/product/catalog';
import { cn, scrollToTopIfHidden } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { ActiveFilters } from './active-filters';
import { FilterSheet } from './filter-sheet';
import { SortSelect } from './sort-select';
import { type FilterGroupView } from '../model/types';
import { useCatalogQuery } from '../model/use-catalog-query';

interface CatalogToolbarProps {
  groups: FilterGroupView[];
  /** Products matching the applied query (server count). */
  total: number;
  /** Compact category/search result for live counts in the filter panel. */
  index: readonly CatalogIndexEntry[];
  /** Server-rendered category chips: toolbar centre (`lg+`) / filter sheet (below). */
  categories: {
    bar: ReactNode;
    panel: ReactNode;
  };
  /** `id` of the anchor above the toolbar that changes scroll back to. */
  scrollAnchorId: string;
}

function ProductsCount({
  total,
  isPending,
  className,
}: {
  total: number;
  isPending: boolean;
  className?: string;
}) {
  const t = useTranslations('common.catalog.filters');

  return (
    <Text
      as="span"
      variant="muted"
      size="none"
      font="secondary"
      aria-live="polite"
      className={cn('relative text-xs tabular-nums sm:text-sm', className)}
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
 * Desktop: Filter + count · category chips (centre) · Sort.
 * Below `lg`: Filter · count (centre) · Sort; categories live in the sheet.
 * Then the active filters bar. Static on every viewport: it scrolls away with
 * the page. Every change resets to page 1 and, if the user had scrolled past
 * it, returns to `scrollAnchorId` (top of the catalog, right above this bar).
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
    <div className="flex flex-col gap-4 px-4 pb-6" aria-busy={isPending}>
      {/* Equal side tracks below `lg` keep the count truly centred */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
        <div className="flex items-center gap-6 justify-self-start">
          <FilterSheet
            groups={groups}
            filters={query.filters}
            onApply={filters => navigate({ ...query, filters })}
            index={index}
            categories={categories.panel}
          />
          <ProductsCount
            total={total}
            isPending={isPending}
            className="max-lg:hidden"
          />
        </div>
        <ProductsCount
          total={total}
          isPending={isPending}
          className="lg:hidden"
        />
        <div className="max-lg:hidden">{categories.bar}</div>
        <div className="justify-self-end">
          <SortSelect
            value={query.sort}
            onChange={sort => navigate(setCatalogSort(query, sort))}
          />
        </div>
      </div>

      <ActiveFilters
        groups={groups}
        filters={query.filters}
        onRemove={(param, value) =>
          navigate({
            ...query,
            filters: toggleFilterValue(query.filters, param, value),
          })
        }
        onClear={() => navigate({ ...query, filters: EMPTY_FILTERS })}
      />
    </div>
  );
}
