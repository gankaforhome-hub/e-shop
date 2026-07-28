'use client';

import Autoplay from 'embla-carousel-autoplay';
import { type FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { bannerSlides } from '../config/banner-data';

import { BannerPagination } from './banner-pagination';
import { BannerSlide } from './banner-slide';

interface IBannerSliderProps {
  className?: string;
}
export const BannerSlider: FC<IBannerSliderProps> = ({ className }) => {
  return (
    <Carousel
      className={cn('relative z-10 h-full w-full', className)}
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          // stopOnMouseEnter: true,
        }),
      ]}
      // isAutoplay
      isFade
      opts={{
        startIndex: 0,
        align: 'start',
        loop: true,
        containScroll: 'trimSnaps',
        duration: 50,
      }}
    >
      <CarouselContent className="flex h-full w-full shrink-0">
        {bannerSlides.map(
          (
            { media: { src, alt, poster, type }, id, slug, title, subTitle },
            index,
          ) => {
            const isFirstSlide = index === 0;
            return (
              <CarouselItem
                key={id}
                className="relative h-full min-h-0 w-full shrink-0 basis-full overflow-hidden"
              >
                <BannerSlide
                  loading={isFirstSlide ? 'eager' : 'lazy'}
                  fetchPriority={isFirstSlide ? 'high' : 'auto'}
                  type={type}
                  src={src}
                  alt={alt ?? ''}
                  poster={poster ?? ''}
                  slug={slug}
                  title={title}
                  subTitle={subTitle ?? ''}
                />
              </CarouselItem>
            );
          },
        )}
      </CarouselContent>

      <Box className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-2">
        {bannerSlides.map((_, idx) => (
          <BannerPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
};
