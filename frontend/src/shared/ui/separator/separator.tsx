import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const separatorVariants = cva('', {
  variants: {
    variant: {
      default: 'border-border',
      accent: 'border-border-accent',
      muted: 'border-border-muted',
    },
    size: {
      xs: 'border',
      sm: 'border-4',
      md: 'border-5',
      lg: 'border-8',
      xl: 'border-10',
    },
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'sm',
    orientation: 'horizontal',
  },
});

interface ISeparatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: true;
}

export const Separator: FC<ISeparatorProps> = ({
  className,
  variant,
  size,
  orientation = 'horizontal',
  ...props
}) => {
  return (
    <div
      className={cn(
        separatorVariants({ orientation, variant, size, className }),
      )}
      {...props}
    />
  );
};
