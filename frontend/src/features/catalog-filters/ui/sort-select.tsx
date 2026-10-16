'use client';

import { useTranslations } from 'next-intl';

import {
  isProductSort,
  type ProductSort,
  productSortOptions,
} from '@/shared/config/routes';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

interface SortSelectProps {
  value: ProductSort | undefined;
  onChange: (sort: ProductSort | undefined) => void;
}

/** Empty radio value = featured (recommended) order. */
const RECOMMENDED = '';

/**
 * Mirrors the Filter trigger (ghost button, icon + label); the current order
 * shows from `sm`. Opens a radio menu (Radix: arrow keys, typeahead, Escape).
 */
export function SortSelect({ value, onChange }: SortSelectProps) {
  const t = useTranslations('common.catalog.sort');
  const currentLabel = value ? t(value) : t('recommended');

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="small"
          aria-label={t('current', { value: currentLabel })}
          className="group gap-2 px-0"
        >
          <Icon name="sort" aria-hidden="true" className="size-4" />
          <Text as="span" size="small" font="secondary" variant="inherit">
            {t('label')}
            <Text
              as="span"
              size="none"
              variant="muted"
              className="max-sm:hidden"
            >
              : {currentLabel}
            </Text>
          </Text>
          <Icon
            name="chevron-down"
            aria-hidden="true"
            className="duration-(--dur-normal) ease-subtle size-4 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value ?? RECOMMENDED}
          onValueChange={next =>
            onChange(isProductSort(next) ? next : undefined)
          }
        >
          <DropdownMenuRadioItem value={RECOMMENDED}>
            {t('recommended')}
          </DropdownMenuRadioItem>
          {productSortOptions.map(option => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
