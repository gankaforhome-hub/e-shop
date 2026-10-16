import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

export type FeatureGridItem = {
  title: string;
  description: string;
};

const featureGridVariants = cva('fgapc-6/12 fgapr-8/12 grid grid-cols-1', {
  variants: {
    columns: {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-2 xl:grid-cols-4',
    },
    align: {
      start: 'text-left',
      center: 'text-center',
    },
  },
  defaultVariants: { columns: 3, align: 'start' },
});

export interface FeatureGridProps extends VariantProps<
  typeof featureGridVariants
> {
  items: FeatureGridItem[];
  /** Item title level; one below the section heading. */
  headingLevel?: 'h3' | 'h4';
  /** Decorative `01`, `02`… index above each title. */
  numbered?: boolean;
  /** Layout only (outer margin, width). */
  className?: string;
}

/** Light grid of short statements (values, benefits, steps), hairline-topped. */
export function FeatureGrid({
  items,
  columns,
  align,
  headingLevel = 'h3',
  numbered = false,
  className,
}: FeatureGridProps) {
  return (
    <ul className={cn(featureGridVariants({ columns, align }), className)}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className="border-border fgap-2/3 fpt-5/6 flex flex-col border-t"
        >
          {numbered && (
            <Text
              as="span"
              size="eyebrow"
              font="secondary"
              variant="accent"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </Text>
          )}
          <Heading headingLevel={headingLevel} variant="subsection">
            {item.title}
          </Heading>
          <Text size="document" font="secondary" variant="muted">
            {item.description}
          </Text>
        </li>
      ))}
    </ul>
  );
}
