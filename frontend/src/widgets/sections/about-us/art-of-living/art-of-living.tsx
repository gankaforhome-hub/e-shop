import { Container } from '@/shared/ui/container';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { type ArtOfLivingSectionProps } from '../about.types';

export function ArtOfLivingSection({
  heading,
  description,
  panel,
}: ArtOfLivingSectionProps) {
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
