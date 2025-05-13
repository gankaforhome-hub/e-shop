import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const separatorVariants = cva('', {
  variants: {
    variant: {
      default: 'border-border-primary',
      accent: 'border-border-accent',
    },
    size: {
      xs: 'border',
      sm: 'border-3',
      md: 'border-10',
    },
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'xs',
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
