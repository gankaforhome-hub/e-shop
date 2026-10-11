import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const sectionVariants = cva('w-full', {
  variants: {
    spacing: {
      none: '',
      default: 'md:pb-15 xl:pb-30 pb-10',
      compact: 'py-8 md:py-12',
      relaxed: 'py-20 md:py-28',
    },
    background: {
      default: '',
      muted: 'bg-muted',
      primary: 'bg-background text-foreground',
    },
    border: {
      none: '',
      top: 'border-t',
      bottom: 'border-b',
      both: 'border-y',
    },
  },
  defaultVariants: {
    spacing: 'default',
    background: 'default',
    border: 'none',
  },
});
export interface ISectionProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  asChild?: boolean;
}

export function Section({
  className,
  spacing,
  children,
  ...props
}: ISectionProps) {
  return (
    <section className={cn(sectionVariants({ spacing }), className)} {...props}>
      {children}
    </section>
  );
}
