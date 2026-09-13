import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface IFaqContentSectionProps {
  lang: Locale;
}

export async function FaqContentSection({ lang }: IFaqContentSectionProps) {
  const { faq } = await getDictionary(['faq'], lang);

  return (
    <Section
      aria-labelledby="faq-content"
      className="md:px-5 lg:px-10 xl:px-20"
    >
      <Container>
        <Heading
          id="faq-content"
          headingLevel="h1"
          variant="pageHeader"
          visibility="hidden"
        >
          {faq.pageTitle}
        </Heading>
        <Accordion
          type="single"
          collapsible
          defaultValue={faq.items[0]?.id} // За замовчуванням відкритий перший пункт як на макеті
          className="w-full space-y-1"
        >
          {faq.items.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
