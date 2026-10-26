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
  headingId: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  eyebrow?: string;
  description?: string;
  accent?: boolean;
  className?: string;
}

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
