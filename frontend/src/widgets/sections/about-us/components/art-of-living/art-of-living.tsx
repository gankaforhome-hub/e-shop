import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { ImageTextPanel } from '../image-text-panel';

import type { ImageTextSectionContent } from '../../api';

export function ArtOfLivingSection({
  heading,
  description,
  panel,
}: ImageTextSectionContent) {
  return (
    <Section aria-labelledby="art-of-living-heading">
      <Container>
        <SectionIntro
          headingId="art-of-living-heading"
          heading={heading}
          description={description}
        />
        <ImageTextPanel {...panel} className="fmt-4/16" />
      </Container>
    </Section>
  );
}
