'use client';

import { useEffect, useState } from 'react';

import { useMatchMedia } from '@/shared/lib/hooks/useMatchMedia';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { type GallerySectionContent } from '../../api';

import { GalleryList, GallerySlider } from './ui';

export function GankaGallery({
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
        />
        <Box className="fmt-4/16">
          {showMobileVersion ? (
            <GallerySlider
              className="lg:hidden"
              images={images}
              paginationPlacement={isMobile ? 'top' : 'bottom'}
            />
          ) : (
            <GalleryList images={images} />
          )}
        </Box>
      </Container>
    </Section>
  );
}
