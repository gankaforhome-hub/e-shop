import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import Image from 'next/image';
import { StorySectionContent } from '../api';
import { SectionIntro } from './section-intro';

export function OurStorySection({
  heading,
  paragraph,
  image,
}: StorySectionContent) {
  return (
    <Section aria-labelledby="our-story-heading" className="fpb-10/30">
      <Container>
        <SectionIntro
          headingId="our-story-heading"
          heading={heading}
          paragraph={paragraph}
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
