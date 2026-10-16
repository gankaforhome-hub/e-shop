'use client';

import { useId, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Checkbox } from '@/shared/ui/checkbox';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { type FilterGroupView } from '../model/types';

/** Options shown before "Show more"; a lone extra option is shown directly. */
const VISIBLE_OPTIONS = 4;

interface FilterGroupProps {
  group: FilterGroupView;
  /** Live counts for the current draft; falls back to the server counts. */
  counts?: Readonly<Record<string, number>> | undefined;
  selected: readonly string[];
  onToggle: (value: string) => void;
}

export function FilterGroup({
  group,
  counts,
  selected,
  onToggle,
}: FilterGroupProps) {
  const t = useTranslations('common.catalog.filters');
  const listId = useId();

  const canCollapse = group.options.length > VISIBLE_OPTIONS + 1;
  const hiddenCount = group.options.length - VISIBLE_OPTIONS;
  // Start expanded when a selected option would otherwise be hidden
  const [isExpanded, setIsExpanded] = useState(() =>
    group.options
      .slice(VISIBLE_OPTIONS)
      .some(option => selected.includes(option.value)),
  );
  const visibleOptions =
    canCollapse && !isExpanded
      ? group.options.slice(0, VISIBLE_OPTIONS)
      : group.options;

  return (
    <AccordionItem
      value={group.param}
      className="border-border border-b p-0 py-4 data-[state=open]:bg-transparent sm:p-0 sm:py-5 md:p-0 md:py-5"
    >
      <AccordionTrigger indicator="chevron" size="small">
        <span>
          {group.label}
          {selected.length > 0 && (
            <span className="sr-only">
              {' '}
              {t('selected', { count: selected.length })}
            </span>
          )}
        </span>
      </AccordionTrigger>

      <AccordionContent className="max-w-none pt-3 md:pt-3">
        <ul id={listId} className="flex flex-col">
          {visibleOptions.map(option => {
            const optionId = `${listId}-${option.value}`;
            const isChecked = selected.includes(option.value);
            const count = counts?.[option.value] ?? option.count;
            // Dimmed in place (not removed) so rows never jump while ticking;
            // a checked option stays enabled so it can always be unticked
            const isDisabled = count === 0 && !isChecked;
            return (
              <li
                key={option.value}
                className={cn(
                  'duration-(--dur-fast) -mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 transition-[background-color,opacity]',
                  isDisabled ? 'opacity-40' : 'hover:bg-muted/50',
                )}
              >
                <Checkbox
                  id={optionId}
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={() => onToggle(option.value)}
                />
                <label
                  htmlFor={optionId}
                  className={cn(
                    'flex flex-1 items-center justify-between gap-3 py-2',
                    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  )}
                >
                  <Text as="span" size="small" font="secondary">
                    {option.label}
                  </Text>
                  <Text
                    as="span"
                    variant="muted"
                    size="none"
                    font="secondary"
                    className="text-xs tabular-nums"
                  >
                    {count}
                  </Text>
                </label>
              </li>
            );
          })}
        </ul>

        {canCollapse && (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={listId}
            onClick={() => setIsExpanded(value => !value)}
            className="font-caption text-action-primary hover:text-action-primary-hover focus-visible:ring-ring mt-2 inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2"
          >
            {isExpanded ? t('showLess') : t('showMore', { count: hiddenCount })}
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              aria-hidden="true"
              className="size-4"
            />
          </button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
