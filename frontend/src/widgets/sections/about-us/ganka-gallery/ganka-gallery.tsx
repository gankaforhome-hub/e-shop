import { Suspense } from 'react';

import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { GankaGallerySkeleton } from './ui';

interface IArtistGallerySectionProps {
  heading: string;
  description: string;
  images: Media[];
}

export function GankaGallerySection({
  heading,
  description,
  images,
}: IArtistGallerySectionProps) {
  return (
    <Section aria-labelledby="artist-gallery-heading">
      <Container>
        <SectionIntro
          headingId="artist-gallery-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />

        <Suspense fallback={<GankaGallerySkeleton count={4} />}>
          <ScrollableContainer
            as="ul"
            className="fmt-4/16"
            indicatorType="progress"
            scrollClassName="xl:grid xl:grid-cols-4 xl:overflow-visible"
            indicatorClassName="xl:!hidden mt-3 md:px-20"
          >
            {images.map((image, index) => (
              <li
                key={image.src}
                className={cn(
                  'rounded-card relative aspect-square shrink-0 snap-start overflow-hidden',
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
