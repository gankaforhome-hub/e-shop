'use client';

import { useEffect, useState } from 'react';

import { type GallerySectionContent } from '@/shared/content/about-us';
import { useMatchMedia } from '@/shared/lib/hooks/useMatchMedia';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { GalleryList, GallerySlider } from './ui';

export function GankaGallerySection({
  heading,
  description,
  images,
}: GallerySectionContent) {
  const { isMobile, isLG } = useMatchMedia();
  const [mounted, setMounted] = useState(false);
  //TODO: learn about hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  const showMobileVersion = mounted ? !isLG : false;

  return (
    <Section aria-labelledby="artist-gallery-heading">
      <Container>
        <SectionIntro
          headingId="artist-gallery-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />
        <Box className="fmt-4/16">
          {showMobileVersion ? (
            <GallerySlider
              opts={{
                align: 'center',
              }}
              classNameItem="shadow-card sm:rounded-card relative aspect-square basis-full overflow-hidden sm:basis-4/5"
              items={images}
              isOpacityTween={!isMobile ? true : false}
              renderItem={(image, index) => (
                <AppMedia
                  src={image.src}
                  alt={image.alt || `Slide ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 33vw, (min-width: 768px) 66vw, 100vw"
                  className="object-cover object-center"
                />
              )}
            />
          ) : (
            <GalleryList images={images} />
          )}
        </Box>
      </Container>
    </Section>
  );
}
