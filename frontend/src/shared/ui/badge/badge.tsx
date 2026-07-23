import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'font-text rounded-badge inline-flex items-center justify-center border p-1 text-xs font-medium capitalize tracking-widest transition-colors',
  {
    variants: {
      variant: {
        new: 'bg-badge-new-bg text-badge-new-fg border-transparent',
        top: 'bg-badge-top-bg text-badge-top-fg border-[0.5px] border-white font-semibold',
        pre_order:
          'bg-badge-popular-bg text-badge-popular-fg border-transparent font-semibold backdrop-blur-sm',
        bestseller:
          'bg-badge-top-bg text-badge-top-fg border-[0.5px] border-white',
        most_popular:
          'bg-badge-popular-bg text-badge-popular-fg border-transparent font-semibold backdrop-blur-sm',
        // TOP
        limited:
          'bg-badge-secondary-bg text-badge-secondary-fg border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800',
        sale: 'bg-badge-secondary-bg text-badge-secondary-fg border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800',
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
}: React.ComponentProps<'span'> &
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
