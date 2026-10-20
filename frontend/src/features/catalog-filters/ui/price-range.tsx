'use client';

import { type ReactNode, useState } from 'react';

import { useTranslations } from 'next-intl';

import { type PriceBounds } from '@/entities/product/catalog';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { getInputClasses } from '@/shared/ui/input';
import { Slider } from '@/shared/ui/slider';

/** Accordion value of the price section (not a facet param). */
export const PRICE_SECTION = 'price';

type PriceExtent = { min: number; max: number };

interface PriceRangeProps {
  label: string;
  /** Lowest/highest SKU price of the draft category: slider bounds, placeholders. */
  extent: PriceExtent;
  value: PriceBounds;
  onChange: (bounds: PriceBounds) => void;
  /** Contextual "Show (N)" shortcut, shown under the inputs after a change; positioned by the caller. */
  applyPopup?: ReactNode;
}

const clamp = (amount: number, { min, max }: PriceExtent) =>
  Math.min(Math.max(amount, min), max);

/** A bound equal to the data edge is no constraint, so it stays open (no URL param). */
const toBounds = ([min, max]: readonly number[], extent: PriceExtent) => ({
  ...(min !== undefined && min > extent.min && { min }),
  ...(max !== undefined && max < extent.max && { max }),
});

interface PriceInputProps {
  prefix: string;
  label: string;
  value: number | undefined;
  placeholder: number;
  onCommit: (amount: number | undefined) => void;
}

/**
 * Digits-only field. Typing stays local and commits on blur / Enter, so a
 * half-typed "1" never jumps the slider or reorders the bounds.
 */
function PriceInput({
  prefix,
  label,
  value,
  placeholder,
  onCommit,
}: PriceInputProps) {
  const [text, setText] = useState<string | null>(null);

  const commit = () => {
    if (text !== null) {
      onCommit(text === '' ? undefined : Number(text));
      setText(null);
    }
  };

  return (
    <label className="relative flex-1">
      <span
        aria-hidden="true"
        className="font-caption text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs"
      >
        {prefix}
      </span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={label}
        value={text ?? value ?? ''}
        placeholder={String(placeholder)}
        onChange={event => setText(event.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
        }}
        className={getInputClasses(
          false,
          'h-10 py-2 pl-9 pr-3 tabular-nums lg:text-sm',
        )}
      />
    </label>
  );
}

/**
 * Dual-thumb price range with "from / to" inputs, both bound to the panel
 * draft. While a thumb moves, only this component re-renders (local drag
 * state mirrored in the inputs); the draft, and with it every live count,
 * updates once on release. Nothing navigates until the panel is applied.
 */
export function PriceRange({
  label,
  extent,
  value,
  onChange,
  applyPopup,
}: PriceRangeProps) {
  const t = useTranslations('common.catalog.filters');
  const [dragging, setDragging] = useState<number[] | null>(null);
  const live = dragging ? toBounds(dragging, extent) : value;
  const hasBounds = value.min !== undefined || value.max !== undefined;
  const thumbs = dragging ?? [
    clamp(value.min ?? extent.min, extent),
    clamp(value.max ?? extent.max, extent),
  ];

  const commit = (side: keyof PriceBounds, amount: number | undefined) => {
    const next =
      side === 'min'
        ? { min: amount, max: value.max }
        : { min: value.min, max: amount };
    onChange(
      toBounds(
        [
          clamp(next.min ?? extent.min, extent),
          clamp(next.max ?? extent.max, extent),
        ].toSorted((a, b) => a - b),
        extent,
      ),
    );
  };

  return (
    <AccordionItem
      value={PRICE_SECTION}
      className="border-border border-b p-0 py-4 data-[state=open]:bg-transparent sm:p-0 sm:py-5 md:p-0 md:py-5"
    >
      <AccordionTrigger indicator="chevron" size="small">
        {label}
      </AccordionTrigger>

      <AccordionContent className="flex max-w-none flex-col gap-4 pt-4 md:pt-4">
        {extent.min < extent.max && (
          <Slider
            min={extent.min}
            max={extent.max}
            value={thumbs}
            minStepsBetweenThumbs={0}
            thumbLabels={[t('priceMin'), t('priceMax')]}
            onValueChange={setDragging}
            onValueCommit={next => {
              setDragging(null);
              onChange(toBounds(next, extent));
            }}
            className="px-2"
          />
        )}
        <div className="flex items-center gap-3">
          <PriceInput
            prefix={t('priceFrom')}
            label={t('priceMin')}
            value={live.min}
            placeholder={extent.min}
            onCommit={amount => commit('min', amount)}
          />
          <span aria-hidden="true" className="bg-border h-px w-3 shrink-0" />
          <PriceInput
            prefix={t('priceTo')}
            label={t('priceMax')}
            value={live.max}
            placeholder={extent.max}
            onCommit={amount => commit('max', amount)}
          />
        </div>
        {/* Always reserved, so the reset link / popup never push content */}
        <div className="flex min-h-8 items-center justify-between gap-3">
          {hasBounds && (
            <button
              type="button"
              onClick={() => onChange({})}
              className="font-caption text-action-primary hover:text-action-primary-hover focus-visible:ring-ring rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2"
            >
              {t('clearPrice')}
            </button>
          )}
          {applyPopup}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
