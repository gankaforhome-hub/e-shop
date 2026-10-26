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
    // Gap to the block that follows, owned here so siblings carry no top
    // margin. Padding, not margin: primitives set no external spacing.
    // `fromMd`: below md the header sits in a padded card (ContentGridSection)
    spacing: {
      none: '',
      default: 'fpb-4/14',
      fromMd: 'md:fpb-4/14',
    },
  },
  defaultVariants: { align: 'center', spacing: 'none' },
});

export interface SectionHeaderProps extends VariantProps<
  typeof sectionHeaderVariants
> {
  heading: string;
  headingId: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  /** `false` keeps the heading for screen readers only (`sr-only`). */
  headingVisible?: boolean;
  /** `display` = Playfair, for collection names only. */
  headingFont?: 'display';
  /** Heading only (e.g. tracking); width and alignment belong to the header. */
  headingClassName?: string;
  eyebrow?: string;
  description?: string;
  /** Description ink: `muted` for editorial blocks, `default` for body copy. */
  descriptionTone?: 'muted' | 'default';
  accent?: boolean;
  className?: string;
}

export function SectionHeader({
  heading,
  headingId,
  headingLevel = 'h2',
  headingVisible = true,
  headingFont,
  headingClassName,
  eyebrow,
  description,
  descriptionTone = 'muted',
  accent = false,
  align,
  spacing,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(sectionHeaderVariants({ align, spacing }), className)}>
      {eyebrow && (
        <Text as="p" size="eyebrow" font="secondary" variant="muted">
          {eyebrow}
        </Text>
      )}
      <Heading
        headingLevel={headingLevel}
        variant="section"
        font={headingFont}
        visibility={headingVisible ? null : 'hidden'}
        id={headingId}
        className={cn('max-w-title', headingClassName)}
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
          variant={descriptionTone === 'muted' ? 'muted' : 'default'}
          className={cn(
            'mx-auto px-4 md:max-w-[95%] md:px-8 lg:max-w-full',
            'items-start text-left',
          )}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
