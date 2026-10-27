import { cn } from '@/shared/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Text } from '@/shared/ui/text';

import { ProductSpecsList } from './product-specs-list';
import { type ProductSpec } from '../../lib/product-specs';
import { type LocalizedProduct } from '../../model/types';

// Flat sections on the page background: no fills, no rules. One open at a
// time (type="single"), "Description" open on load
const ITEM_CLASS =
  'data-[state=open]:bg-transparent p-0 py-4 sm:p-0 sm:py-4 md:p-0 md:py-5';
// Titles 16px medium (a step bolder than the 16px body), sentence case
const TRIGGER_PROPS = {
  indicator: 'chevron',
  size: 'base',
  className:
    'font-text text-foreground group-data-[state=open]:text-foreground-emphasis hover:text-foreground-emphasis duration-(--dur-normal) font-medium transition-colors',
  indicatorClassName:
    'group-data-[state=open]:text-action-primary duration-(--dur-normal) transition-colors',
} as const;
// Breathing room inside an open section (the base adds the top offset)
const CONTENT_CLASS = 'px-2 pb-3 sm:px-4 md:pb-4';

interface ProductAccordionsProps {
  product: Pick<LocalizedProduct, 'description'>;
  /** Static specifications (`getProductSpecs`), a section of their own. */
  specs: ProductSpec[];
  label: {
    descriptionAndDetails: string;
    specifications: string;
    careAndUse: string;
    careInstructionsText: string;
  };
}

export function ProductAccordions({
  product,
  specs,
  label,
}: ProductAccordionsProps) {
  const { description } = product;
  const {
    descriptionAndDetails,
    specifications,
    careAndUse,
    careInstructionsText,
  } = label;
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="description"
      // With the column gap-6: 40 → 48 → 56px below the purchase buttons
      className="mt-4 w-full md:mt-6 lg:mt-8"
    >
      <AccordionItem value="description" className={ITEM_CLASS}>
        <AccordionTrigger {...TRIGGER_PROPS}>
          {descriptionAndDetails}
        </AccordionTrigger>
        <AccordionContent className={CONTENT_CLASS}>
          {/* Reading size: 16px on every viewport, relaxed leading */}
          <Text size="none" className="text-base leading-relaxed">
            {description}
          </Text>
        </AccordionContent>
      </AccordionItem>

      {specs.length > 0 && (
        <AccordionItem value="specifications" className={ITEM_CLASS}>
          <AccordionTrigger {...TRIGGER_PROPS}>
            {specifications}
          </AccordionTrigger>
          <AccordionContent className={CONTENT_CLASS}>
            <ProductSpecsList specs={specs} />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="care" className={ITEM_CLASS}>
        <AccordionTrigger {...TRIGGER_PROPS}>{careAndUse}</AccordionTrigger>
        <AccordionContent className={cn(CONTENT_CLASS, 'space-y-2')}>
          <p>{careInstructionsText}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
