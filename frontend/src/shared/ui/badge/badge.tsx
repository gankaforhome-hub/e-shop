import { type ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'font-text inline-flex select-none items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-normal uppercase tracking-widest backdrop-blur-md transition-colors',
  {
    variants: {
      variant: {
        new: 'bg-badge-new-bg text-badge-new-text border-white/40 shadow-sm',
        pre_order:
          'bg-badge-preorder-bg text-badge-preorder-text border-white/20 font-medium',
        bestseller:
          'bg-badge-bestseller-bg/85 text-badge-bestseller-text border-white/50 font-semibold shadow-sm',
        most_popular:
          'bg-badge-popular-bg text-badge-popular-text border-white/20 font-medium',
        limited:
          'bg-badge-limited-bg/80 text-badge-limited-text hover:bg-badge-limited-bg border-white/30',
        sale: 'bg-badge-sale-bg/85 text-badge-sale-text hover:bg-badge-sale-bg border-white/50',
      },
    },
    defaultVariants: {
      variant: 'new',
    },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

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

export { Badge, type BadgeVariants };
