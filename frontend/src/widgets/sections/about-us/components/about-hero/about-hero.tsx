import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { type AboutHeroContent } from '../../api';
import { ImageTextPanel } from '../image-text-panel';

export function AboutHeroSection({
  heading,
  description,
  panel,
}: AboutHeroContent) {
  return (
    <>
      <Section aria-labelledby="about-ganka-heading">
        <Container>
          <SectionIntro
            heading={heading}
            description={description}
            headingId="about-ganka-heading"
          />
          <ImageTextPanel {...panel} className="fmt-4/16" />
        </Container>
      </Section>
    </>
  );
}
