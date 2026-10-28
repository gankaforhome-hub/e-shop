import { type ComponentProps } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

/** One option of a segmented control: a toggle button (`aria-pressed`) or a link. */
export const segmentedItemVariants = cva(
  'inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-[color,background-color,box-shadow] duration-(--dur-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4',
  {
    variants: {
      active: {
        true: 'bg-card text-foreground-emphasis shadow-sm',
        false: 'text-foreground hover:text-foreground-emphasis',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

/** Pill track for 2–4 mutually exclusive options; label it with `aria-label`. */
export function Segmented({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="segmented"
      className={cn('flex rounded-lg bg-muted p-1', className)}
      {...props}
    />
  );
}
