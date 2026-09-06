import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const textVariants = cva('font-normal tracking-normal', {
  variants: {
    variant: {
      default: 'text-foreground',
      secondary: 'text-text-secondary text-lg tracking-wider',
      accent: 'text-accent-foreground',
      danger: 'text-text-error',
      inherit: 'text-inherit',
    },
    size: {
      main: 'text-sm md:text-base lg:text-lg xl:text-xl 2xl:xl:text-2xl',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    position: {
      left: 'text-left',
      center: 'max-w-[95%] text-center',
    },
    font: { primary: 'font-text', secondary: 'font-caption' },
    // weight: {
    //   normal: "font-normal",
    //   medium: "font-medium",
    //   semibold: "font-semibold",
    //   bold: "font-bold",
    // },
    // align: {
    //   left: "text-left",
    //   center: "text-center",
    //   right: "text-right",
    //   justify: "text-justify",
    // },
  },

  defaultVariants: {
    variant: 'default',
    size: 'main',
    font: 'primary',
    // weight: "normal",
    // align: "left",
  },
  compoundVariants: [
    // { variant: "default", size: "lg", class: "h-10 w-10" },
  ],
});

interface ITextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  className?: string;
  as?: 'p' | 'span';
}

export function Text({
  className,
  variant,
  size,
  position,
  font,
  // size,
  as = 'p',
  ...props
}: ITextProps) {
  const Component = as;
  return (
    <Component
      className={cn(textVariants({ variant, font, size, position, className }))}
      {...props}
    />
  );
}
