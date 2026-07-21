import Image from 'next/image';

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
        <Box className="aspect-4/3 fmt-4/16 relative overflow-hidden rounded-xl md:aspect-video">
          <Image
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
