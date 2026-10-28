import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

export const headingVariants = cva('text-balance text-foreground-emphasis', {
  variants: {
    variant: {
      /** Page title (`h1`): 24 → 28px. */
      page: 'text-2xl font-semibold tracking-tight md:text-[1.75rem] md:leading-9',
      /** Card and empty-state titles: 16px. */
      card: 'text-base font-semibold',
    },
    visibility: { hidden: 'sr-only' },
  },
  defaultVariants: {
    variant: 'page',
  },
});

interface HeadingProps
  extends
    HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  headingLevel: 'h1' | 'h2' | 'h3';
}

export function Heading({
  headingLevel,
  variant,
  visibility,
  className,
  ...props
}: HeadingProps) {
  const Tag = headingLevel;

  return (
    <Tag
      className={cn(headingVariants({ variant, visibility, className }))}
      {...props}
    />
  );
}
