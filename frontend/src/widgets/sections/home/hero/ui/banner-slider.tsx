'use client';

import { useMemo } from 'react';

import Autoplay from 'embla-carousel-autoplay';

import { cn } from '@/shared/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselCurrent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { type TBannerSlide } from '@/widgets/sections/home/hero/model/types';

import { BannerSlide } from './banner-slide';

interface BannerSliderProps {
  bannerSlides: TBannerSlide[];
  ctaLabel: string;
  className?: string;
}

export function BannerSlider({
  className,
  bannerSlides,
  ctaLabel,
}: BannerSliderProps) {
  // Embla plugins only run in the browser, so reading matchMedia here can't
  // cause a hydration mismatch; autoplay is skipped for reduced-motion users.
  const plugins = useMemo(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion
      ? []
      : [Autoplay({ delay: 4000, stopOnInteraction: false })];
  }, []);

  return (
    <Carousel
      className={cn('relative z-10 h-full w-full', className)}
      plugins={plugins}
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
                alt={slide.media.alt ?? slide.title}
                poster={slide.media.poster ?? ''}
                index={index}
                ctaLabel={ctaLabel}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-2">
        {bannerSlides.map((_, idx) => (
          <CarouselCurrent key={idx} to={idx} />
        ))}
      </div>
    </Carousel>
  );
}
