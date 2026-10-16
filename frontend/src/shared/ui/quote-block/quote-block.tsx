import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Text } from '@/shared/ui/text';

const quoteBlockVariants = cva('fgap-4/6 max-w-title flex flex-col', {
  variants: {
    align: {
      center: 'mx-auto items-center text-center',
      start: 'items-start text-left',
    },
  },
  defaultVariants: { align: 'start' },
});

export interface QuoteBlockProps extends VariantProps<
  typeof quoteBlockVariants
> {
  quote: string;
  /** Source line under the quote (brand, author). */
  cite?: string;
  /** Short brand-coloured rule above the quote. */
  accent?: boolean;
  /** Layout only (outer margin, width). */
  className?: string;
}

/** Editorial pull quote / manifesto line in the heading typeface. */
export function QuoteBlock({
  quote,
  cite,
  accent = true,
  align,
  className,
}: QuoteBlockProps) {
  return (
    <figure className={cn(quoteBlockVariants({ align }), className)}>
      {accent && (
        <span aria-hidden="true" className="bg-action-primary h-px w-12" />
      )}
      <blockquote>
        <Text size="quote" font="heading" className="text-balance">
          {quote}
        </Text>
      </blockquote>
      {cite && (
        <Text as="figcaption" size="eyebrow" font="secondary" variant="muted">
          {cite}
        </Text>
      )}
    </figure>
  );
}
