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
      /** Editorial pages: 32 → 56px top and bottom, so two adjacent
       *  sections sit 64 → 112px apart. */
      editorial: 'fpy-8/14',
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
export interface SectionProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {}

export function Section({
  className,
  spacing,
  background,
  border,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionVariants({ spacing, background, border }),
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
