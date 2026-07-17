import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { ImageTextPanel } from './image-text-panel';
import { SectionIntro } from './section-intro';

import type { ImageTextSectionContent } from '../api';

export function ArtOfLivingSection({
  heading,
  paragraph,
  panel,
}: ImageTextSectionContent) {
  return (
    <Section aria-labelledby="art-of-living-heading" className="fpb-10/30">
      <Container>
        <SectionIntro
          headingId="art-of-living-heading"
          heading={heading}
          paragraph={paragraph}
        />
        <Box className="fmt-4/16">
          <ImageTextPanel {...panel} />
        </Box>
      </Container>
    </Section>
  );
}
