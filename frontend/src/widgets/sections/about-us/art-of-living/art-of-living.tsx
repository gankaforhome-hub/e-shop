import { type Media } from '@/shared/types';
import { Container } from '@/shared/ui/container';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';

interface ArtOfLivingSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  panel: {
    image: Media;
    imagePosition: 'left' | 'right';
    paragraphs: string;
  };
}

/** Craftsmanship / ceramics artistry block. */
export function ArtOfLivingSection({
  eyebrow,
  heading,
  description,
  panel,
}: ArtOfLivingSectionProps) {
  return (
    <Section spacing="editorial" aria-labelledby="art-of-living-heading">
      <Container>
        <SectionHeader
          headingId="art-of-living-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />
        <ImageTextPanel {...panel} surface="warm" />
      </Container>
    </Section>
  );
}
