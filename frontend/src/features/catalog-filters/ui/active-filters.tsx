'use client';

import { useTranslations } from 'next-intl';

import {
  CATALOG_FILTER_PARAMS,
  type CatalogFilterParam,
  getFilterValues,
  type ProductFilters,
} from '@/entities/product/catalog';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { type FilterGroupView } from '../model/types';

interface ActiveFiltersProps {
  groups: FilterGroupView[];
  filters: ProductFilters;
  onRemove: (param: CatalogFilterParam, value: string) => void;
  onClear: () => void;
}

/** Summary bar: one removable chip per applied value + "Clear all". */
export function ActiveFilters({
  groups,
  filters,
  onRemove,
  onClear,
}: ActiveFiltersProps) {
  const t = useTranslations('common.catalog.filters');

  // Panel order (collections → seasons → material → decoration → category
  // attributes → features → price) and option order within a group, never
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

  if (chips.length === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={t('activeLabel')}
      className="flex flex-wrap items-center gap-2"
    >
      <Text
        as="span"
        variant="muted"
        size="none"
        font="secondary"
        aria-hidden="true"
        className="mr-1 text-xs"
      >
        {t('activeLabel')}:
      </Text>
      {chips.map(chip => (
        <button
          key={`${chip.param}:${chip.value}`}
          type="button"
          aria-label={t('remove', { label: chip.label })}
          onClick={() => onRemove(chip.param, chip.value)}
          className="font-caption border-border bg-muted/40 text-foreground hover:border-action-primary focus-visible:ring-ring duration-(--dur-fast) inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs outline-none transition-colors focus-visible:ring-2"
        >
          {chip.label}
          <Icon name="x" aria-hidden="true" className="size-3.5" />
        </button>
      ))}
      <Button variant="link" size="small" className="px-2" onClick={onClear}>
        {t('clearAll')}
      </Button>
    </div>
  );
}
