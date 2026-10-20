'use client';

import { useTranslations } from 'next-intl';

import {
  CATALOG_FILTER_PARAMS,
  type CatalogFilterParam,
  getFilterValues,
  type ProductFilters,
} from '@/entities/product/catalog';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { type FilterGroupView } from '../model/types';

interface ActiveFiltersProps {
  groups: FilterGroupView[];
  filters: ProductFilters;
  /** Selected category title; rendered as the first chip. */
  categoryLabel?: string | undefined;
  /** Formatted draft price range ("1 900–5 000 грн"); rendered last. */
  priceLabel?: string | undefined;
  onRemovePrice?: () => void;
  onRemove: (param: CatalogFilterParam, value: string) => void;
  onRemoveCategory: () => void;
  /** Layout only. */
  className?: string;
}

// Subtle pill: hairline border, no fill; the close mark brightens on hover
const chipClassName =
  'group font-caption border-border text-foreground hover:bg-muted/50 focus-visible:ring-ring duration-(--dur-fast) inline-flex min-h-8 items-center gap-1 rounded-full border bg-transparent pl-3 pr-2 text-xs outline-none transition-colors focus-visible:ring-1';
const closeIconClassName =
  'text-muted-foreground group-hover:text-foreground duration-(--dur-fast) size-3 transition-colors';

/**
 * Compact "Selected filters" summary of the filter sheet draft: the category
 * first, then one removable chip per value. Removing a chip edits the draft
 * only; "Clear all" lives in the sheet footer.
 */
export function ActiveFilters({
  groups,
  filters,
  categoryLabel,
  priceLabel,
  onRemovePrice,
  onRemove,
  onRemoveCategory,
  className,
}: ActiveFiltersProps) {
  const t = useTranslations('common.catalog.filters');

  // Panel order (collections → seasons → material → decoration → category
  // attributes → features, then the price range) and option order within a group, never
  // the order of selection. Params with no panel group (a URL value outside
  // the current category) follow in their canonical order.
  const panelParams = groups.map(group => group.param);
  const orderedParams = [
    ...panelParams,
    ...CATALOG_FILTER_PARAMS.filter(param => !panelParams.includes(param)),
  ];

  const chips = orderedParams.flatMap(param => {
    const selected = getFilterValues(filters, param);
    if (selected.length === 0) {
      return [];
    }
    const options = groups.find(group => group.param === param)?.options ?? [];
    const rank = (value: string) => {
      const index = options.findIndex(option => option.value === value);
      return index === -1 ? options.length : index;
    };
    return selected
      .toSorted((a, b) => rank(a) - rank(b))
      .map(value => ({
        param,
        value,
        label: options.find(option => option.value === value)?.label ?? value,
      }));
  });

  if (chips.length === 0 && !categoryLabel && !priceLabel) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={t('activeLabel')}
      className={cn('flex flex-col gap-2', className)}
    >
      <Text
        as="span"
        variant="muted"
        size="none"
        font="secondary"
        aria-hidden="true"
        className="text-xs"
      >
        {t('activeLabel')}
      </Text>
      {/* Capped height: a long selection scrolls instead of crowding the list */}
      <div className="scrollbar-thin flex max-h-[4.75rem] flex-wrap gap-1.5 overflow-y-auto overscroll-contain">
        {categoryLabel && (
          <button
            type="button"
            aria-label={t('remove', { label: categoryLabel })}
            onClick={onRemoveCategory}
            className={chipClassName}
          >
            {categoryLabel}
            <Icon name="x" aria-hidden="true" className={closeIconClassName} />
          </button>
        )}
        {chips.map(chip => (
          <button
            key={`${chip.param}:${chip.value}`}
            type="button"
            aria-label={t('remove', { label: chip.label })}
            onClick={() => onRemove(chip.param, chip.value)}
            className={chipClassName}
          >
            {chip.label}
            <Icon name="x" aria-hidden="true" className={closeIconClassName} />
          </button>
        ))}
        {priceLabel && (
          <button
            type="button"
            aria-label={t('remove', { label: priceLabel })}
            onClick={onRemovePrice}
            className={cn(chipClassName, 'tabular-nums')}
          >
            {priceLabel}
            <Icon name="x" aria-hidden="true" className={closeIconClassName} />
          </button>
        )}
      </div>
    </div>
  );
}
