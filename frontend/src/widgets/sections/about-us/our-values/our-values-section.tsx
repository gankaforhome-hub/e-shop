import { Container } from '@/shared/ui/container';
import { FeatureGrid, type FeatureGridItem } from '@/shared/ui/feature-grid';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';

interface OurValuesSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: FeatureGridItem[];
}

/** Brand values as a numbered three-column grid. */
export function OurValuesSection({
  eyebrow,
  heading,
  description,
  items,
}: OurValuesSectionProps) {
  return (
    <Section spacing="editorial" aria-labelledby="our-values-heading">
      <Container>
        <SectionHeader
          headingId="our-values-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          className="mb-4 md:mb-8 lg:mb-10 xl:mb-16"
        />
        <FeatureGrid items={items} numbered />
      </Container>
    </Section>
  );
}
