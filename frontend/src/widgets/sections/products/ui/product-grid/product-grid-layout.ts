import { cn } from '@/shared/lib/utils';

/**
 * Shared by `ProductGrid` and `ProductGridSkeleton`, so the skeleton always
 * has the same tracks as the real grid (zero CLS). CSS-only: one column
 * below 340px, two below `lg`, three, then four from `2xl`.
 */
export const productGridClassName =
  'grid grid-cols-2 gap-4 max-[339px]:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4';

/**
 * Editorial rhythm from 340px to `sm`: every third card (and a lone last
 * one) spans both columns; `isMasonry` spans them all. Scoped as a range
 * (not overridden below 340px): Tailwind emits arbitrary `max-[…]` rules
 * before `max-sm`, so an override would lose and the span would add an
 * implicit track that overflows the single column.
 */
export function getProductGridItemClassName(
  index: number,
  count: number,
  isMasonry = false,
) {
  const isThird = (index + 1) % 3 === 0;
  const isLastAlone = index === count - 1 && count % 3 === 1;

  return cn(
    (isMasonry || isThird || isLastAlone) && 'min-[340px]:max-sm:col-span-2',
  );
}
