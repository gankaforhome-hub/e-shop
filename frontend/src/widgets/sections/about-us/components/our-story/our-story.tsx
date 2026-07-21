import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { type StorySectionContent } from '../../api';

export function OurStorySection({
  heading,
  description,
  image,
}: StorySectionContent) {
  return (
    <Section aria-labelledby="our-story-heading">
      <Container>
        <SectionIntro
          headingId="our-story-heading"
          heading={heading}
          description={description}
        />
        <Box className="fmt-4/16 shadow-card 2xl:aspect-1754/988 relative overflow-hidden rounded-xl md:aspect-video">
          <AppMedia
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 1100px, 90vw"
            className="object-cover"
          />
        </Box>
      </Container>
    </Section>
  );
}
