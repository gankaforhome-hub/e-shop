import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const sectionVariants = cva('w-full', {
  variants: {
    spacing: {
      none: '',
      default: 'md:pb-15 xl:pb-30 pb-10',
      /** Platform rhythm: 32 → 48 → 64px top and bottom. */
      compact: 'py-8 md:py-12 lg:py-16',
      /** Platform rhythm: 48 → 64 → 96px top and bottom. */
      standard: 'py-12 md:py-16 lg:py-24',
      relaxed: 'py-20 md:py-28',
    },
    /** `top`: first section after `Breadcrumbs`, whose margin owns that gap. */
    flush: {
      none: '',
      top: 'pt-0 md:pt-0 lg:pt-0',
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
    flush: 'none',
    background: 'default',
    border: 'none',
  },
});
export interface SectionProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {}

export function Section({
  className,
  spacing,
  flush,
  background,
  border,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionVariants({ spacing, flush, background, border }),
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
