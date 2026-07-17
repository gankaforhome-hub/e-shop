import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const separatorVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-bg-primary',
      muted: 'bg-border-muted',
      accent: 'bg-border-accent',
      accentMuted: 'bg-border-accent/40',
    },
    size: {
      xs: 'h-px',
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
