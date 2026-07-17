'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useMatchMedia } from '@/shared/lib/hooks/useMatchMedia';
import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { GalleryPagination } from './gallery-pagination';
import { SectionIntro } from './section-intro';

import type { GallerySectionContent } from '../api';

export function GankaGallery({
  heading,
  paragraph,
  images,
}: GallerySectionContent) {
  const { isMobile, isLG } = useMatchMedia();
  const [mounted, setMounted] = useState(false); // Стейт для відстеження гідрації
  //TODO: learn about hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  const showMobileVersion = mounted ? !isLG : false;
  return (
    <Section aria-labelledby="artist-gallery-heading" className="fpb-10/30">
      <Container>
        <SectionIntro
          headingId="artist-gallery-heading"
          heading={heading}
          paragraph={paragraph}
        />
        <Box className="fmt-4/16">
          {showMobileVersion && (
            <Carousel
              opts={{
                loop: true,
                align: 'center',
                duration: 100,
              }}
              isOpacityTween
              className="max-w-400 w-full"
            >
              <CarouselContent className="-ml-1">
                {images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className={cn(
                      'shadow-card relative aspect-square basis-full overflow-hidden rounded-xl pl-1 md:basis-2/3',
                    )}
                  >
                    {/* Картинка слайда */}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, (min-width: 768px) 66vw, 100vw"
                      className="object-cover object-center" //transition-transform duration-300 hover:scale-105
                    />

                    {isMobile && (
                      <Box className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                        <Box className="bg-overlay backdrop-blur-xs flex gap-5 rounded-full px-3 py-2">
                          {' '}
                          {images.map((_, idx) => (
                            <GalleryPagination key={idx} to={idx} />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>

              {!isMobile && (
                <Box className="pt-5">
                  <Box className="flex justify-center gap-5 px-4 py-3">
                    {images.map((_, idx) => (
                      <GalleryPagination
                        key={idx}
                        to={idx}
                        dotsType="secondary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Carousel>
          )}

          {!showMobileVersion && (
            <ul role="list" className="grid grid-cols-4 gap-4">
              {images.map(image => (
                <li
                  key={image.src}
                  className="shadow-card relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1280px) 24vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Container>
    </Section>
  );
}
