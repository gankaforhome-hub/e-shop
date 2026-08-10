import { type Media } from '@/shared/types';
import { Container } from '@/shared/ui/container';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

interface IArtOfLivingSectionProps {
  heading: string;
  description: string;
  panel: {
    image: Media;
    imagePosition: 'left' | 'right';
    paragraphs: string;
  };
}

export function ArtOfLivingSection({
  heading,
  description,
  panel,
}: IArtOfLivingSectionProps) {
  return (
    <Section aria-labelledby="art-of-living-heading">
      <Container>
        <SectionIntro
          headingId="art-of-living-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />
        <ImageTextPanel {...panel} className="fmt-4/16" />
      </Container>
    </Section>
  );
}
