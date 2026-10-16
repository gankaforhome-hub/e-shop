import { type Media } from '@/shared/types';
import { Container } from '@/shared/ui/container';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';

interface AboutHeroSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  panel: { image: Media; imagePosition: 'left' | 'right'; paragraphs: string };
}

/** Brand philosophy: the page `h1` + intro panel (LCP image). */
export function AboutHeroSection({
  eyebrow,
  heading,
  description,
  panel,
}: AboutHeroSectionProps) {
  return (
    <Section spacing="editorial" aria-labelledby="about-ganka-heading">
      <Container>
        <SectionHeader
          headingLevel="h1"
          headingId="about-ganka-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          accent
        />
        <ImageTextPanel {...panel} accent priority />
      </Container>
    </Section>
  );
}
