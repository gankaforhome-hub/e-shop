import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface IFaqContentSectionProps {
  lang: Locale;
}

export async function FaqContentSection({ lang }: IFaqContentSectionProps) {
  const { faq } = await getDictionary(['faq'], lang);

  return (
    <Section spacing="none" aria-labelledby="faq-content">
      <Heading
        id="faq-content"
        headingLevel="h1"
        variant="pageHeader"
        position="center"
        className="mx-auto mb-4"
      >
        {faq.pageTitle}
      </Heading>
      <Accordion
        type="single"
        collapsible
        defaultValue={faq.data[0]?.id}
        className="w-full space-y-1"
      >
        {faq.data.map((item, index) => (
          <AccordionItem key={index} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
