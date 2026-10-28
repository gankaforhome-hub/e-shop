import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      emphasis: 'text-foreground-emphasis',
      muted: 'text-muted-foreground',
      /** Brand accent: eyebrows, status highlights. */
      brand: 'text-brand',
      inherit: 'text-inherit',
    },
    size: {
      base: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
      /** Small caps label above a title. */
      eyebrow: 'text-xs font-semibold tracking-[0.08em] uppercase',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
  },
});

export interface TextProps<T extends ElementType = 'p'> extends VariantProps<
  typeof textVariants
> {
  as?: T;
  className?: string;
  children?: ReactNode;
}

export type PolymorphicTextProps<T extends ElementType> = TextProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextProps<T>>;

export function Text<T extends ElementType = 'p'>({
  as,
  className,
  variant,
  size,
  weight,
  children,
  ...props
}: PolymorphicTextProps<T>) {
  const Component = as ?? 'p';

  return (
    <Component
      className={cn(textVariants({ variant, size, weight, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}
