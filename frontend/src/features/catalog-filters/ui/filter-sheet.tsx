'use client';

import { useMemo, useState } from 'react';

import { useFormatter, useTranslations } from 'next-intl';

import {
  type CatalogFilterParam,
  type CatalogIndexEntry,
  countActiveFilters,
  countMatchingProducts,
  EMPTY_FILTERS,
  getFacetCounts,
  getFilterValues,
  getPriceExtent,
  hasPriceBounds,
  type PriceBounds,
  type ProductFilters,
  setPriceBounds,
  toggleFilterValue,
} from '@/entities/product/catalog';
import { type CategorySlug } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
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

import { ActiveFilters } from './active-filters';
import { CategorySelect } from './category-select';
import { FilterGroup } from './filter-group';
import { PRICE_SECTION, PriceRange } from './price-range';
import { sortOptions } from '../lib/sort-options';
import {
  type CategoryFilterGroups,
  type CategoryOption,
  type FilterDraft,
  type FilterGroupView,
} from '../model/types';

/** Option values per group in display order. */
type OptionOrder = Partial<Record<CatalogFilterParam, readonly string[]>>;

/** Control a "Show (N)" popup appears next to after a change. */
type ToggledOption =
  { param: CatalogFilterParam; value: string } | typeof PRICE_SECTION;

// Shared look of the popup; each anchor adds its own positioning
const popupClassName =
  'animate-in fade-in-0 zoom-in-95 duration-(--dur-normal) h-8 px-3 tabular-nums shadow-md motion-reduce:animate-none';

/** Expanded on open as the primary entry point; the rest start collapsed. */
const PRIMARY_GROUP = 'collection';

interface FilterSheetProps {
  groups: CategoryFilterGroups;
  categories: readonly CategoryOption[];
  /** Applied category from the URL. */
  category: CategorySlug | undefined;
  /** Applied filters from the URL. */
  filters: ProductFilters;
  onApply: (draft: FilterDraft) => void;
  /** An applied query is loading (navigation transition). */
  isPending: boolean;
  /** Search result across all categories, to count the draft against. */
  index: readonly CatalogIndexEntry[];
}

const groupsFor = (
  groups: CategoryFilterGroups,
  category: CategorySlug | undefined,
) => (category ? (groups.byCategory[category] ?? []) : groups.all);

/** Keeps only selections that still exist in `groups` (after a category switch); the price range carries over. */
function keepAvailable(
  filters: ProductFilters,
  groups: readonly FilterGroupView[],
): ProductFilters {
  return groups.reduce(
    (next, group) => {
      const available = new Set(group.options.map(option => option.value));
      return getFilterValues(filters, group.param)
        .filter(value => available.has(value))
        .reduce(
          (acc, value) => toggleFilterValue(acc, group.param, value),
          next,
        );
    },
    setPriceBounds(EMPTY_FILTERS, filters.price),
  );
}

/**
 * Left side panel. Category and filter selections are a local draft applied
 * in one navigation ("Show N products"), so the catalog re-renders once
 * instead of per click. Groups, option counts and the result count follow
 * the draft (including its category) live. Options left with no products are
 * dimmed and disabled, never removed; the option order (with products first,
 * see `sortOptions`) is frozen when the panel opens or the draft category
 * changes, so rows never jump while the user is ticking. Price is a draft range (slider + inputs) bounded by
 * the prices of the products matching the other draft filters. Applying keeps
 * the panel open with a busy button until the new catalog has arrived, then
 * closes it. Closing without applying keeps the draft for the next open; only
 * a URL change (apply, browser back) resets it.
 */
export function FilterSheet({
  groups: groupsByCategory,
  categories,
  category,
  filters,
  onApply,
  isPending,
  index,
}: FilterSheetProps) {
  const t = useTranslations('common.catalog.filters');
  const tGroups = useTranslations('common.catalog.groups');
  const format = useFormatter();
  const [isOpen, setIsOpen] = useState(false);
  const applied: FilterDraft = { category, filters };
  const [draft, setDraft] = useState(applied);
  const [toggled, setToggled] = useState<ToggledOption | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // URL changed (apply, browser back): restart the draft from it
  const [synced, setSynced] = useState(applied);
  if (filters !== synced.filters || category !== synced.category) {
    setSynced(applied);
    setDraft(applied);
    // The optimistic URL arrives right after "Apply": keep the clicked popup
    if (!isApplying) {
      setToggled(null);
    }
  }
  // Applied query loaded (transition settled): close over the new catalog
  if (isApplying && !isPending) {
    setIsApplying(false);
    setIsOpen(false);
    setToggled(null);
  }

  const groups = groupsFor(groupsByCategory, draft.category);
  const draftIndex = useMemo(
    () =>
      draft.category
        ? index.filter(entry => entry.categorySlug === draft.category)
        : index,
    [index, draft.category],
  );

  // Slider bounds: prices of the products matching the other draft filters
  // (falls back to the whole category when they match nothing)
  const priceExtent = useMemo(
    () =>
      getPriceExtent(draftIndex, draft.filters) ?? getPriceExtent(draftIndex),
    [draftIndex, draft.filters],
  );
  const hasPrice = hasPriceBounds(draft.filters);
  // Categories with products first, then Latin before Cyrillic, alphabetical
  const sortedCategories = useMemo(() => {
    const withProducts = new Set(index.map(entry => entry.categorySlug));
    return sortOptions(
      categories.map(item => ({
        ...item,
        value: item.slug,
        label: item.title,
      })),
      item => (withProducts.has(item.slug) ? 1 : 0),
    );
  }, [categories, index]);

  const activeCount = countActiveFilters(filters) + (category ? 1 : 0);
  const draftCount = countActiveFilters(draft.filters);
  const resultCount = useMemo(
    () => countMatchingProducts(draftIndex, draft.filters),
    [draftIndex, draft.filters],
  );
  const counts = useMemo(
    () =>
      getFacetCounts(
        draftIndex,
        draft.filters,
        groups.map(group => ({
          param: group.param,
          values: group.options.map(option => option.value),
        })),
      ),
    [draftIndex, draft.filters, groups],
  );

  // Order snapshot taken from the live counts on open / category switch
  // (adjust-state-during-render; no effect, no extra commit)
  const orderKey = isOpen ? (draft.category ?? '') : null;
  const [frozen, setFrozen] = useState<{
    key: string | null;
    order: OptionOrder;
  }>({ key: null, order: {} });
  if (orderKey !== frozen.key) {
    setFrozen({
      key: orderKey,
      order: Object.fromEntries(
        groups.map(group => [
          group.param,
          sortOptions(
            group.options,
            option => counts[group.param]?.[option.value] ?? option.count,
          ).map(option => option.value),
        ]),
      ),
    });
  }
  // The accordion remounts on every open and on every group-set change, so
  // this re-evaluates each time: any group with a checked option opens too
  const defaultOpen: string[] = [
    ...groups
      .filter(
        group =>
          group.param === PRIMARY_GROUP ||
          getFilterValues(draft.filters, group.param).length > 0,
      )
      .map(group => group.param),
    ...(hasPrice ? [PRICE_SECTION] : []),
  ];

  const { min, max } = draft.filters.price;
  const priceLabel = hasPrice
    ? t('priceChip', {
        bound: min === undefined ? 'max' : max === undefined ? 'min' : 'both',
        min: format.number(min ?? 0),
        max: format.number(max ?? 0),
      })
    : undefined;

  const categoryLabel = categories.find(
    item => item.slug === draft.category,
  )?.title;

  const toggleDraftValue = (param: CatalogFilterParam, value: string) =>
    setDraft(current => ({
      ...current,
      filters: toggleFilterValue(current.filters, param, value),
    }));

  // Toggling in a list anchors the popup there; summary chips, category
  // switch and "Clear all" are away from the list, so they dismiss it
  const handleOptionToggle = (param: CatalogFilterParam, value: string) => {
    toggleDraftValue(param, value);
    setToggled({ param, value });
  };

  const handleChipRemove = (param: CatalogFilterParam, value: string) => {
    toggleDraftValue(param, value);
    setToggled(null);
  };

  const handlePriceChange = (bounds: PriceBounds) => {
    setDraft(current => ({
      ...current,
      filters: setPriceBounds(current.filters, bounds),
    }));
    setToggled(PRICE_SECTION);
  };

  const handlePriceRemove = () => {
    handlePriceChange({});
    setToggled(null);
  };

  const handleCategoryChange = (next: CategorySlug | undefined) => {
    setToggled(null);
    setDraft(current => ({
      category: next,
      filters: keepAvailable(
        current.filters,
        groupsFor(groupsByCategory, next),
      ),
    }));
  };

  // Starts the navigation transition; the panel closes once it settles
  const handleApply = () => {
    setIsApplying(true);
    onApply(draft);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setToggled(null);
    setIsApplying(false);
  };

  // Same label/state as the footer button: "Show (N)" or a disabled
  // "No matches found"
  const applyLabel = t('showProducts', { count: resultCount });
  // Busy: spinner over the hidden label, so the button keeps its width
  const applyContent = (
    <>
      <span className={cn(isApplying && 'invisible')}>{applyLabel}</span>
      {isApplying && (
        <Icon
          name="spinner"
          aria-hidden="true"
          className="absolute inset-0 m-auto size-4 animate-spin"
        />
      )}
    </>
  );
  const renderApplyPopup = (className: string) => (
    <Button
      size="small"
      disabled={resultCount === 0 || isApplying}
      aria-busy={isApplying}
      onClick={handleApply}
      className={cn(popupClassName, 'relative', className)}
    >
      {applyContent}
    </Button>
  );
  // Option rows: floated over the row's count, so no sibling row shifts
  const optionPopup = renderApplyPopup(
    'absolute right-0 top-1/2 z-10 -translate-y-1/2',
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="small"
          className="shrink-0 gap-2 px-0 max-[339px]:size-9"
        >
          <Icon name="sliders" aria-hidden="true" className="size-4" />
          {/* The only active-filter indicator ("Filter (N)"); icon-only below
              340px, where the label stays as the accessible name */}
          <Text
            as="span"
            size="small"
            font="secondary"
            variant="inherit"
            className="tabular-nums max-[339px]:sr-only"
          >
            {t('trigger', { count: activeCount })}
          </Text>
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

        {/* The bottom panel is sticky inside the scroller, so the list slides
            under its translucent, blurred backdrop */}
        <div className="scrollbar-thin flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="flex-1 px-5">
            {categories.length > 0 && (
              <div className="border-border border-b py-5">
                <Text
                  as="p"
                  size="small"
                  font="secondary"
                  aria-hidden="true"
                  className="mb-3 font-semibold"
                >
                  {t('category')}
                </Text>
                <CategorySelect
                  categories={sortedCategories}
                  value={draft.category}
                  onChange={handleCategoryChange}
                />
              </div>
            )}
            {groups.length > 0 || priceExtent ? (
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
                    selected={getFilterValues(draft.filters, group.param)}
                    onToggle={value => handleOptionToggle(group.param, value)}
                    toggledValue={
                      typeof toggled === 'object' &&
                      toggled?.param === group.param
                        ? toggled.value
                        : undefined
                    }
                    applyPopup={optionPopup}
                    order={frozen.order[group.param]}
                  />
                ))}
                {priceExtent && (
                  <PriceRange
                    label={tGroups('price')}
                    extent={priceExtent}
                    value={draft.filters.price}
                    onChange={handlePriceChange}
                    applyPopup={
                      toggled === PRICE_SECTION && renderApplyPopup('ml-auto')
                    }
                  />
                )}
              </Accordion>
            ) : (
              <Text variant="muted" size="document" className="py-6">
                {t('noFilters')}
              </Text>
            )}
          </div>

          <div className="border-border bg-background/80 sticky bottom-0 mt-auto border-t backdrop-blur-md">
            <ActiveFilters
              groups={groups}
              filters={draft.filters}
              categoryLabel={categoryLabel}
              priceLabel={priceLabel}
              onRemovePrice={handlePriceRemove}
              onRemove={handleChipRemove}
              onRemoveCategory={() => handleCategoryChange(undefined)}
              className="px-5 pt-3"
            />
            <SheetFooter className="flex gap-3 px-5 py-4">
              <Button
                variant="outline"
                size="small"
                className="flex-1"
                disabled={draftCount === 0 && !draft.category}
                onClick={() => {
                  setDraft({ category: undefined, filters: EMPTY_FILTERS });
                  setToggled(null);
                }}
              >
                {t('clearAll')}
              </Button>
              <Button
                size="small"
                className="relative flex-1 tabular-nums"
                disabled={resultCount === 0 || isApplying}
                aria-busy={isApplying}
                onClick={handleApply}
              >
                {applyContent}
              </Button>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
