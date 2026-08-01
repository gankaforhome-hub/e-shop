import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

import { Box } from '../box';

export const separatorVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-border',
      muted: 'bg-muted',
      accent: 'bg-accent-border',
      accentMuted: 'bg-accent-border/40',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },
  compoundVariants: [
    // Horizontal sizes
    { orientation: 'horizontal', size: 'xs', class: 'h-px' },
    { orientation: 'horizontal', size: 'sm', class: 'h-0.5' },
    { orientation: 'horizontal', size: 'md', class: 'h-1' },
    { orientation: 'horizontal', size: 'lg', class: 'h-2' },
    { orientation: 'horizontal', size: 'xl', class: 'h-2.5' },
    // Vertical sizes
    { orientation: 'vertical', size: 'xs', class: 'w-px' },
    { orientation: 'vertical', size: 'sm', class: 'w-0.5' },
    { orientation: 'vertical', size: 'md', class: 'w-1' },
    { orientation: 'vertical', size: 'lg', class: 'w-2' },
    { orientation: 'vertical', size: 'xl', class: 'w-2.5' },
  ],
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
  decorative?: boolean;
}

export const Separator: FC<ISeparatorProps> = ({
  className,
  variant,
  size,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => {
  return (
    <Box
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        separatorVariants({ orientation, variant, size, className }),
      )}
      {...props}
    />
  );
};
