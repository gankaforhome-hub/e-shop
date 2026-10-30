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
      /** Page-level numerals (e.g. 404): 48 → 60px. */
      display: 'text-5xl leading-none font-semibold tracking-tight md:text-6xl',
      base: 'text-base',
      /** Intro under a page title: 15px. */
      lead: 'text-[0.9375rem]',
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
