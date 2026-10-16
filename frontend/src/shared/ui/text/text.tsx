import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const textVariants = cva('font-normal tracking-normal', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-foreground',
      secondary: 'text-secondary-foreground',
      muted: 'text-muted-foreground',
      card: 'text-foreground',
      caption: 'text-inherit',
      accent: 'text-accent-foreground',
      error: 'text-status-error-fg',
      success: 'text-status-success-fg',
      inherit: 'text-inherit',
    },
    size: {
      text: 'text-base xl:text-lg',
      label: 'text-base xl:text-lg',
      status: 'text-base xl:text-lg',
      commerce: 'text-base xl:text-lg',
      /** 16px → 18px scaled continuously between 320px and 1920px viewports. */
      fluid: 'ftext-4/4.5 fleading-6/7',
      /** Long-form documents: 14 → 16px, relaxed leading. */
      document: 'text-sm leading-relaxed md:text-base',
      /** Compact UI controls (filters, menus): fixed 14px. */
      small: 'text-sm',
      /** Editorial intro copy: 16 → 18px, airy leading. */
      lead: 'text-base leading-relaxed xl:text-lg',
      /** Small uppercase label above a heading (kicker / eyebrow). */
      eyebrow: 'text-xs uppercase tracking-widest',
      /** Pull quote: 20 → 30px, use with `font="heading"`. */
      quote: 'text-xl italic leading-snug md:text-2xl xl:text-3xl',
      none: '',
    },
    position: {
      left: 'text-left',
      center: 'max-w-[95%] text-center',
    },
    font: {
      primary: 'font-text',
      secondary: 'font-caption',
      heading: 'font-heading',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'text',
    font: 'primary',
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
  position,
  font,
  children,
  ...props
}: PolymorphicTextProps<T>) {
  const Component = as ?? 'p';

  return (
    <Component
      className={cn(textVariants({ variant, font, size, position, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}
