import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'font-text inline-flex select-none items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-normal uppercase tracking-widest backdrop-blur-md transition-colors',
  {
    variants: {
      variant: {
        new: 'bg-badge-new-bg text-badge-new-text border-white/40 shadow-sm dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-200',

        top: 'bg-badge-top-bg text-badge-top-text border-white/50 font-semibold shadow-sm dark:border-amber-700/50 dark:bg-amber-900/80',

        pre_order:
          'bg-badge-preorder-bg text-badge-preorder-text border-white/20 font-medium dark:border-neutral-700 dark:bg-white/80 dark:text-neutral-900',

        bestseller:
          'bg-badge-bestseller-bg/85 text-badge-bestseller-text border-white/50 font-semibold shadow-sm dark:border-amber-700/50 dark:bg-amber-900/80',

        most_popular:
          'bg-badge-popular-bg text-badge-popular-text border-white/20 font-medium dark:border-neutral-700 dark:bg-white/80 dark:text-neutral-900',

        limited:
          'border-slate-300/60 bg-slate-100/80 text-slate-800 hover:bg-slate-200/80 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80',

        sale: 'bg-badge-sale-bg/85 text-badge-sale-text hover:bg-badge-sale-bg border-rose-200/50 dark:border-rose-800/50 dark:bg-rose-900/80 dark:hover:bg-rose-900',
      },
    },
    defaultVariants: {
      variant: 'new',
    },
  },
);

type IBadgeVariants = VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = 'new',
  asChild = false,
  ...props
}: ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, type IBadgeVariants };
