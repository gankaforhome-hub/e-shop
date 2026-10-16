import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

import { type LocalizedProduct } from '../../model/types';

interface ProductAccordionsProps {
  product: LocalizedProduct;
  label: {
    descriptionAndDetails: string;
    careAndUse: string;
    careInstructionsText: string;
    deliveryAndReturns: string;
    deliveryTermsText: string;
  };
}

export function ProductAccordions({ product, label }: ProductAccordionsProps) {
  const {
    descriptionAndDetails,
    careAndUse,
    careInstructionsText,
    deliveryAndReturns,
    deliveryTermsText,
  } = label;
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="description"
      className="w-full pt-4"
    >
      <AccordionItem value="description">
        <AccordionTrigger>{descriptionAndDetails}</AccordionTrigger>
        <AccordionContent>
          <p className="mb-3">{product.description}</p>
          {product.characteristics.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {product.characteristics.map(attr => (
                <li key={attr.nameKey}>
                  <strong>{attr.name}:</strong> {attr.value}
                </li>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="care">
        <AccordionTrigger>{careAndUse}</AccordionTrigger>
        <AccordionContent className="space-y-2">
          <p>{careInstructionsText}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery">
        <AccordionTrigger>{deliveryAndReturns}</AccordionTrigger>
        <AccordionContent>
          <p>{deliveryTermsText}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
