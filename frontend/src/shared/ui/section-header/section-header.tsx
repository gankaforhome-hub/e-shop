import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

const sectionHeaderVariants = cva('fgap-3/5 flex w-full flex-col', {
  variants: {
    align: {
      center: 'items-center text-center',
      start: 'items-start text-left',
    },
  },
  defaultVariants: { align: 'center' },
});

export interface SectionHeaderProps extends VariantProps<
  typeof sectionHeaderVariants
> {
  heading: string;
  /** Referenced by the section's `aria-labelledby`. */
  headingId: string;
  /** `h1` only for the page's first section (one `h1` per page). */
  headingLevel?: 'h1' | 'h2' | 'h3';
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  description?: string;
  /** Short brand-coloured rule between heading and description. */
  accent?: boolean;
  /** Layout only (outer margin, width). */
  className?: string;
}

/**
 * Editorial section opener: eyebrow · heading · accent rule · lead copy.
 * Heading capped at `max-w-title`; description full width, 80% of the
 * header from `lg`, always left-aligned (centred as a column when
 * `align="center"`). Pure, no outer margin.
 */
export function SectionHeader({
  heading,
  headingId,
  headingLevel = 'h2',
  eyebrow,
  description,
  accent = false,
  align,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(sectionHeaderVariants({ align }), className)}>
      {eyebrow && (
        <Text as="p" size="eyebrow" font="secondary" variant="muted">
          {eyebrow}
        </Text>
      )}
      <Heading
        headingLevel={headingLevel}
        variant="section"
        id={headingId}
        className="max-w-title"
      >
        {heading}
      </Heading>
      {accent && (
        <span aria-hidden="true" className="bg-action-primary h-px w-12" />
      )}
      {description && (
        <Text
          size="lead"
          font="secondary"
          variant="muted"
          className="w-full text-left lg:w-4/5"
        >
          {description}
        </Text>
      )}
    </header>
  );
}
