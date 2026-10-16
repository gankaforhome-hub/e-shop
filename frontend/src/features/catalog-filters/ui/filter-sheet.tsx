'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  type CatalogIndexEntry,
  countActiveFilters,
  countMatchingProducts,
  EMPTY_FILTERS,
  getFacetCounts,
  getFilterValues,
  type ProductFilters,
  toggleFilterValue,
} from '@/entities/product/catalog';
import { Accordion } from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Text } from '@/shared/ui/text';

import { FilterGroup } from './filter-group';
import { type FilterGroupView } from '../model/types';

/** Expanded on open as the primary entry point; the rest start collapsed. */
const PRIMARY_GROUP = 'collection';

interface FilterSheetProps {
  groups: FilterGroupView[];
  /** Applied filters from the URL. */
  filters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  /** Category/search result to count the draft against. */
  index: readonly CatalogIndexEntry[];
  /** Category chips, shown at the top of the panel below `lg` only. */
  categories?: ReactNode;
}

/**
 * Left side panel. Selections are a local draft applied in one navigation
 * ("Show N products"), so the catalog re-renders once instead of per
 * checkbox. Option counts and the result count follow the draft live.
 * Category chips navigate at once; the page keeps its state across query
 * changes, so the panel stays open and its groups switch to the new category.
 */
export function FilterSheet({
  groups,
  filters,
  onApply,
  index,
  categories,
}: FilterSheetProps) {
  const t = useTranslations('common.catalog.filters');
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  // URL changed while open (e.g. a category chip): restart the draft from it
  const [syncedFilters, setSyncedFilters] = useState(filters);
  if (filters !== syncedFilters) {
    setSyncedFilters(filters);
    setDraft(filters);
  }

  const activeCount = countActiveFilters(filters);
  const draftCount = countActiveFilters(draft);
  const resultCount = useMemo(
    () => countMatchingProducts(index, draft),
    [index, draft],
  );
  const counts = useMemo(
    () =>
      getFacetCounts(
        index,
        draft,
        groups.map(group => ({
          param: group.param,
          values: group.options.map(option => option.value),
        })),
      ),
    [index, draft, groups],
  );
  // The sheet remounts its content on every open, so this re-evaluates against
  // the applied filters each time: any group with a checked option opens too
  const defaultOpen = groups
    .filter(
      group =>
        group.param === PRIMARY_GROUP ||
        getFilterValues(filters, group.param).length > 0,
    )
    .map(group => group.param);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraft(filters);
    }
    setIsOpen(open);
  };

  const handleApply = () => {
    onApply(draft);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="small" className="gap-2 px-0">
          <Icon name="sliders" aria-hidden="true" className="size-4" />
          <Text as="span" size="small" font="secondary" variant="inherit">
            {t('open')}
          </Text>
          {activeCount > 0 && (
            <span className="sr-only">
              {t('selected', { count: activeCount })}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="max-w-md shadow-xl"
      >
        <SheetHeader className="border-border flex items-center justify-between gap-4 border-b px-5 py-4">
          <SheetTitle asChild>
            <Heading headingLevel="h2" variant="subsection">
              {t('title')}
            </Heading>
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label={t('close')}>
              <Icon name="x" aria-hidden="true" className="size-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5">
          {categories && (
            <div className="border-border border-b py-5 lg:hidden">
              <Text
                as="p"
                size="small"
                font="secondary"
                aria-hidden="true"
                className="mb-3 font-semibold"
              >
                {t('category')}
              </Text>
              {categories}
            </div>
          )}
          {groups.length > 0 ? (
            <Accordion
              // New category → new groups: reset which ones start expanded
              key={groups.map(group => group.param).join()}
              type="multiple"
              defaultValue={defaultOpen}
            >
              {groups.map(group => (
                <FilterGroup
                  key={group.param}
                  group={group}
                  counts={counts[group.param]}
                  selected={getFilterValues(draft, group.param)}
                  onToggle={value =>
                    setDraft(current =>
                      toggleFilterValue(current, group.param, value),
                    )
                  }
                />
              ))}
            </Accordion>
          ) : (
            <Text variant="muted" size="document" className="py-6">
              {t('noFilters')}
            </Text>
          )}
        </div>

        <SheetFooter className="border-border flex gap-3 border-t px-5 py-4">
          <Button
            variant="outline"
            size="small"
            className="flex-1"
            disabled={draftCount === 0}
            onClick={() => setDraft(EMPTY_FILTERS)}
          >
            {t('clearAll')}
          </Button>
          <Button
            size="small"
            className="flex-1 tabular-nums"
            disabled={resultCount === 0}
            onClick={handleApply}
          >
            {t('showProducts', { count: resultCount })}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
