import { FC, ReactNode } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

interface IAccordionFooterProps {
  className?: string;
  heading: ReactNode;
  content: ReactNode;
  item: string;
}

export const AccordionFooter: FC<IAccordionFooterProps> = ({
  className,
  heading,
  content,
  item,
}) => {
  return (
    <AccordionItem value={item} className={className}>
      <AccordionTrigger className="font-text text-xl font-medium uppercase tracking-wide">
        {heading}
      </AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>
  );
};
