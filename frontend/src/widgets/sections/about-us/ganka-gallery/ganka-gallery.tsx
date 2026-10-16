import { Suspense } from 'react';

import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';

import { GankaGallerySkeleton } from './ui';

interface ArtistGallerySectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  images: Media[];
}

/** Media showcase: scrollable row below `xl`, four-column grid above. */
export function GankaGallerySection({
  eyebrow,
  heading,
  description,
  images,
}: ArtistGallerySectionProps) {
  return (
    <Section spacing="editorial" aria-labelledby="artist-gallery-heading">
      <Container>
        <SectionHeader
          headingId="artist-gallery-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />

        <Suspense fallback={<GankaGallerySkeleton count={4} />}>
          <ScrollableContainer
            as="ul"
            className="mt-4 md:mt-8 lg:mt-10 xl:mt-16"
            indicatorType="progress"
            scrollClassName="xl:grid xl:grid-cols-4 xl:overflow-visible"
            indicatorClassName="xl:!hidden mt-3 md:px-20"
          >
            {images.map((image, index) => (
              <li
                key={`${image.src}-${index}`}
                className={cn(
                  'relative aspect-square shrink-0 snap-start overflow-hidden',
                  'w-full min-w-full',
                  'sm:w-[calc((100%-16px)/2)] sm:min-w-[calc((100%-16px)/2)]',
                  'md:w-[calc((100%-16px)/3)] md:min-w-[calc((100%-16px)/3)]',
                  'xl:w-auto xl:min-w-0 xl:shrink',
                )}
              >
                <AppMedia
                  src={image.src}
                  alt={image.alt || `Slide ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </li>
            ))}
          </ScrollableContainer>
        </Suspense>
      </Container>
    </Section>
  );
}
