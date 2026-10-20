import { type Stockist } from '@/shared/i18n/schemas/contacts.schema';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';
import { Text } from '@/shared/ui/text';

export interface StockistsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  directions: string;
  items: Stockist[];
}

const HEADING_ID = 'stockists-heading';

/** Physical points of sale (e.g. Citronelle) with a map directions link. */
export function StockistsSection({
  eyebrow,
  heading,
  description,
  directions,
  items,
}: StockistsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby={HEADING_ID} spacing="editorial">
      <Container className="fgap-8/16 flex flex-col">
        <SectionHeader
          headingId={HEADING_ID}
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />
        <ul className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {items.map(item => (
            <li
              key={item.id}
              className="bg-surface-warm fp-6/10 flex w-full flex-col gap-6 rounded-lg md:max-w-md"
            >
              <div className="flex flex-col gap-2">
                <Text as="span" size="eyebrow" font="secondary" variant="muted">
                  {item.type}
                </Text>
                <Heading headingLevel="h3" variant="subsection">
                  {item.name}
                </Heading>
              </div>
              <address className="flex items-start gap-3 not-italic">
                <Icon
                  name="location"
                  className="text-muted-foreground mt-1 size-5"
                  aria-hidden
                />
                <Text as="span" size="lead" className="flex flex-col">
                  <span>{item.address}</span>
                  <span>{item.city}</span>
                </Text>
              </address>
              <Button
                asChild
                variant="outline"
                className="w-full gap-2 sm:w-auto sm:self-start"
              >
                <AppLink
                  href={item.mapUrl}
                  aria-label={`${directions}: ${item.name}`}
                >
                  {directions}
                  <Icon name="arrow-up-right" className="size-4" aria-hidden />
                </AppLink>
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
