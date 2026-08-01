'use client';

import { title } from 'process';

import Autoplay from 'embla-carousel-autoplay';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { type TBannerSlide } from '../model/types';

import { BannerPagination } from './banner-pagination';
import { BannerSlide } from './banner-slide';

interface IBannerSlider {
  bannerSlides: TBannerSlide[];
  className?: string;
}
export function BannerSlider({ className, bannerSlides }: IBannerSlider) {
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
        {bannerSlides.map((slide, index) => {
          const isFirstSlide = index === 0;
          return (
            <CarouselItem
              key={`Slide-${slide.slug}`}
              className="relative h-full min-h-0 w-full shrink-0 basis-full overflow-hidden"
            >
              <BannerSlide
                bannerSlide={slide}
                loading={isFirstSlide ? 'eager' : 'lazy'}
                fetchPriority={isFirstSlide ? 'high' : 'auto'}
                src={slide.media.src}
                alt={slide.media.alt ?? title}
                poster={slide.media.poster ?? ''}
                index={index}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <Box className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-2">
        {bannerSlides.map((_, idx) => (
          <BannerPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
}
