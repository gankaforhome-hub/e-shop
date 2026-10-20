'use client';

import { type ReactNode, useId, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Checkbox } from '@/shared/ui/checkbox';
import { Icon } from '@/shared/ui/icon';
import { getInputClasses } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

import { sortOptions } from '../lib/sort-options';
import { type FilterGroupView, type FilterOptionView } from '../model/types';

/** Options shown before "Show more"; a lone extra option is shown directly. */
const VISIBLE_OPTIONS = 4;
/** Lists longer than this get a client-side search box. */
const SEARCH_THRESHOLD = 6;

interface FilterGroupProps {
  group: FilterGroupView;
  /** Live counts for the current draft; falls back to the server counts. */
  counts?: Readonly<Record<string, number>> | undefined;
  selected: readonly string[];
  onToggle: (value: string) => void;
  /** Last toggled option in this group; its row hosts `applyPopup`. */
  toggledValue?: string | undefined;
  /** Contextual "Show (N)" shortcut, floated over the toggled row. */
  applyPopup?: ReactNode;
  /**
   * Option values in display order, frozen by the panel while it stays open,
   * so rows never move under the pointer. Without it the live order is used.
   */
  order?: readonly string[] | undefined;
}

export function FilterGroup({
  group,
  counts,
  selected,
  onToggle,
  toggledValue,
  applyPopup,
  order,
}: FilterGroupProps) {
  const t = useTranslations('common.catalog.filters');
  const listId = useId();
  const [term, setTerm] = useState('');

  const countOf = (option: FilterOptionView) =>
    counts?.[option.value] ?? option.count;
  // Every option stays listed: one with no products for the draft is dimmed
  // and disabled in place (checked ones stay enabled so they can be unticked).
  // Options missing from the frozen order (none in practice) go last
  const rank = new Map(order?.map((value, index) => [value, index]));
  const available = order
    ? group.options.toSorted(
        (a, b) =>
          (rank.get(a.value) ?? rank.size) - (rank.get(b.value) ?? rank.size),
      )
    : sortOptions(group.options, countOf);
  // Kept while a term is typed, even if the list shrinks below the threshold
  const hasSearch = available.length > SEARCH_THRESHOLD || term !== '';
  const needle = term.trim().toLocaleLowerCase();
  const matches = needle
    ? available.filter(option =>
        option.label.toLocaleLowerCase().includes(needle),
      )
    : available;

  // Searching shows every match; otherwise collapse long lists
  const canCollapse = !needle && matches.length > VISIBLE_OPTIONS + 1;
  const hiddenCount = matches.length - VISIBLE_OPTIONS;
  // Start expanded when a selected option would otherwise be hidden
  const [isExpanded, setIsExpanded] = useState(() =>
    available
      .slice(VISIBLE_OPTIONS)
      .some(option => selected.includes(option.value)),
  );
  const visibleOptions =
    canCollapse && !isExpanded ? matches.slice(0, VISIBLE_OPTIONS) : matches;

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
        {hasSearch && (
          <input
            type="search"
            value={term}
            onChange={event => setTerm(event.target.value)}
            placeholder={t('searchOptions', { group: group.label })}
            aria-label={t('searchOptions', { group: group.label })}
            aria-controls={listId}
            className={getInputClasses(false, 'mb-2 h-10 py-2 lg:text-sm')}
          />
        )}
        <ul id={listId} className="flex flex-col">
          {visibleOptions.map(option => {
            const optionId = `${listId}-${option.value}`;
            const isChecked = selected.includes(option.value);
            const isDisabled = !isChecked && countOf(option) === 0;
            return (
              <li
                key={option.value}
                className={cn(
                  'duration-(--dur-fast) relative -mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 transition-colors',
                  !isDisabled && 'hover:bg-muted/50',
                )}
              >
                <Checkbox
                  variant="minimal"
                  id={optionId}
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={() => onToggle(option.value)}
                />
                <label
                  htmlFor={optionId}
                  className={cn(
                    'duration-(--dur-fast) flex flex-1 items-center justify-between gap-3 py-2 transition-opacity',
                    isDisabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer',
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
                    {countOf(option)}
                  </Text>
                </label>
                {option.value === toggledValue && applyPopup}
              </li>
            );
          })}
        </ul>
        {needle && matches.length === 0 && (
          <Text variant="muted" size="small" font="secondary" className="py-2">
            {t('noMatches')}
          </Text>
        )}

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
