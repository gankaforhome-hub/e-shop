import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'font-text rounded-badge inline-flex select-none items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-normal uppercase tracking-widest backdrop-blur-md transition-colors',
  {
    variants: {
      variant: {
        new: 'border-white/40 bg-white/70 text-neutral-800 shadow-sm dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-200',

        top: 'bg-accent-foreground border-white/50 font-semibold text-white shadow-sm dark:border-amber-700/50 dark:bg-amber-900/80',

        pre_order:
          'border-white/20 bg-neutral-900/75 font-medium text-white dark:border-neutral-700 dark:bg-white/80 dark:text-neutral-900',

        bestseller:
          'border-white/50 bg-amber-500/85 font-semibold text-white shadow-sm dark:border-amber-700/50 dark:bg-amber-900/80',

        most_popular:
          'border-white/20 bg-neutral-900/75 font-medium text-white dark:border-neutral-700 dark:bg-white/80 dark:text-neutral-900',

        limited:
          'border-slate-300/60 bg-slate-100/80 text-slate-800 hover:bg-slate-200/80 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80',

        sale: 'border-rose-200/50 bg-rose-500/85 text-white hover:bg-rose-600/90 dark:border-rose-800/50 dark:bg-rose-900/80 dark:hover:bg-rose-900',
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
