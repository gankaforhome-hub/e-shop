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

interface FaqContentSectionProps {
  lang: Locale;
}

export async function FaqContentSection({ lang }: FaqContentSectionProps) {
  const { faq } = await getDictionary(['faq'], lang);

  return (
    <Section
      spacing="none"
      aria-labelledby="faq-content"
      className="fgap-5/8 flex flex-col"
    >
      <Heading id="faq-content" headingLevel="h1" variant="document">
        {faq.pageTitle}
      </Heading>
      <Accordion
        type="single"
        collapsible
        defaultValue={faq.data[0]?.id}
        className="divide-border border-border w-full divide-y border-y"
      >
        {faq.data.map(item => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="data-[state=open]:bg-muted/30 px-0 py-4 sm:px-4 sm:py-5 md:px-5"
          >
            <AccordionTrigger
              indicator="chevron"
              size="compact"
              className="font-text group-data-[state=open]:text-action-primary hover:text-action-primary duration-(--dur-normal) font-medium tracking-wide transition-colors"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground max-w-3xl">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
