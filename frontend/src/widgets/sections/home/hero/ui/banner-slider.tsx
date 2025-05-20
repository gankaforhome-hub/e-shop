'use client';

import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { MediaSlide } from '@/widgets/media-slide';

import { bannerSlides } from '../config/banner-data';

import { BannerPagination } from './banner-pagination';

interface IBannerSliderProps {
  className?: string;
}

export const BannerSlider: FC<IBannerSliderProps> = ({ className }) => {
  return (
    <Carousel
      className={cn('absolute inset-0 left-0 top-0 h-full w-full', className)}
      isAutoplay
      isFade
      opts={{
        align: 'start',
        loop: true,
        containScroll: false,
        duration: 100,
      }}
    >
      <CarouselContent className="h-100vw z-20 w-full">
        {bannerSlides.map(({ src, alt, poster, type }) => (
          <CarouselItem key={`${src}`}>
            <MediaSlide
              width={1620}
              height={850}
              sizes="(max-width: 768px) 100vw, 1200px"
              type={type}
              src={src}
              alt={alt ?? ''}
              poster={poster ?? ''}
              className="h-[calc(90vh-var(--h-mob-header))] sm:h-[calc(80vh-var(--h-mob-header))]"
              overlay
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <Box className="-translate-1/2 absolute bottom-12 left-1/2 z-50 flex items-center justify-center gap-2">
        {bannerSlides.map((_, idx) => (
          <BannerPagination key={idx} to={idx} />
        ))}
      </Box>
    </Carousel>
  );
};
