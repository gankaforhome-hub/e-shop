'use client';

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
      isAutoplay
      isFade
      opts={{
        startIndex: 0,
        align: 'start',
        loop: true,
        containScroll: false,
        duration: 100,
      }}
    >
      <CarouselContent
        className={cn(
          'h-full w-full shrink-0',
          // 'h-[calc(100vh-var(--h-topbar))] w-full md:h-[calc(100vh-var(--h-header,var(--h-mob-header)))]',
        )}
      >
        {bannerSlides.map(
          ({
            media: { src, alt, poster, type },
            id,
            slug,
            title,
            subTitle,
          }) => (
            <CarouselItem
              key={id}
              className="relative h-[calc(100dvh-var(--h-topbar))]"
            >
              <BannerSlide
                // width={1620}
                // height={850}
                type={type}
                src={src}
                alt={alt ?? ''}
                poster={poster ?? ''}
                slug={slug}
                title={title}
                subTitle={subTitle ?? ''}
              />
            </CarouselItem>
          ),
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
