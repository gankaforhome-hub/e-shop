import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { type OurStorySectionProps } from '../about.types';

export function OurStorySection({
  heading,
  description,
  image,
}: OurStorySectionProps) {
  return (
    <Section aria-labelledby="our-story-heading">
      <Container>
        <SectionIntro
          headingId="our-story-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />
        <Box className="fmt-4/16 shadow-card 2xl:aspect-1754/988 relative aspect-square overflow-hidden rounded-xl sm:aspect-video">
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
