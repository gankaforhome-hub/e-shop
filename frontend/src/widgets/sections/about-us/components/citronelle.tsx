import Image from 'next/image';

import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { type MapSectionContent } from '../api';

import { SectionIntro } from './section-intro';

export function CitronelleSection({
  heading,
  paragraph,
  mapImage,
  mapEmbedUrl,
}: MapSectionContent) {
  return (
    <Section aria-labelledby="citronelle-heading" className="fpb-4/10">
      <Container>
        <SectionIntro
          headingId="citronelle-heading"
          heading={heading}
          paragraph={paragraph}
        />
        <Box className="aspect-4/3 relative mt-8 overflow-hidden rounded-xl sm:aspect-video">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title="Map of Citronelle restaurant locations in Kyiv"
              loading="lazy"
              className="h-full w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <Image
              src={mapImage.src}
              alt={mapImage.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 90vw"
              className="object-cover"
            />
          )}
        </Box>
      </Container>
    </Section>
  );
}
