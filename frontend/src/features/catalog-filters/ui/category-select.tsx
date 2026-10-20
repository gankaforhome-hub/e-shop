'use client';

import { useTranslations } from 'next-intl';

import { type CategorySlug } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';

import { type CategoryOption } from '../model/types';

interface CategorySelectProps {
  categories: readonly CategoryOption[];
  /** Draft category; `undefined` = all. */
  value: CategorySlug | undefined;
  onChange: (category: CategorySlug | undefined) => void;
}

// Caption font at 14px. Active = underline only, no weight change: the text
// width stays the same, so the row never reflows when the selection switches
const optionClassName = cn(
  'font-caption text-foreground relative inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-sm text-sm font-normal tracking-wide',
  'duration-(--dur-normal) ease-subtle transition-opacity',
  'focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-4',
  'after:bg-action-primary after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0',
  'after:duration-(--dur-normal) after:ease-subtle after:transition-transform motion-reduce:after:transition-none',
  'aria-pressed:after:scale-x-100',
  'not-aria-pressed:hover:opacity-70',
);

/**
 * Single-select category options of the filter panel. Only edits the draft:
 * nothing navigates until the panel is applied. Tapping the active option
 * returns to all categories.
 */
export function CategorySelect({
  categories,
  value,
  onChange,
}: CategorySelectProps) {
  const t = useTranslations('common.catalog.filters');

  return (
    <div
      role="group"
      aria-label={t('category')}
      className="flex flex-wrap justify-start gap-x-6 gap-y-1 md:gap-x-8"
    >
      <button
        type="button"
        aria-pressed={value === undefined}
        onClick={() => onChange(undefined)}
        className={optionClassName}
      >
        {t('allCategories')}
      </button>
      {categories.map(category => {
        const isActive = value === category.slug;

        return (
          <button
            key={category.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? undefined : category.slug)}
            className={optionClassName}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}
