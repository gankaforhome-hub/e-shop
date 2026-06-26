import { cva, VariantProps } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const separatorVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-border',
      accent: 'bg-border-accent',
      muted: 'bg-border-muted',
    },
    size: {
      xs: 'h-0.25',
      sm: 'h-0.5',
      md: 'h-1',
      lg: 'h-2',
      xl: 'h-2.5',
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
  extends
    HTMLAttributes<HTMLDivElement>,
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
