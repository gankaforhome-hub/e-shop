'use client';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { cn } from '@/shared/lib/utils/index';

import { CarouselProps } from './types';
import { CarouselContext } from './useCarousel';

import { CarouselApi } from '.';

interface ICarouselProps extends HTMLAttributes<HTMLDivElement>, CarouselProps {
  orientation?: 'horizontal' | 'vertical';
}

export const Carousel: FC<ICarouselProps> = ({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  isAutoplay,
  isFade,
  className,
  children,
  ...props
}) => {
  const mergedPlugins = [
    ...(plugins ?? []), // будь-які плагіни, передані напряму
    ...(isAutoplay
      ? [
          Autoplay({
            delay: 4000,
          }),
        ]
      : []),
    ...(isFade ? [Fade()] : []),
  ];

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    mergedPlugins,
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [current, setCurrent] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const pauseInactiveVideos = useCallback((api: CarouselApi) => {
    if (!api) return;
    const currentIndex = api.selectedScrollSnap();
    const slideNodes = api.slideNodes();

    let anyVideoPaused = false;

    slideNodes.forEach((slide, index) => {
      const videos = slide.getElementsByTagName('video');

      Array.from(videos).forEach(video => {
        if (index !== currentIndex && !video.paused) {
          video.pause();
          anyVideoPaused = true;
        }
      });
    });

    if (currentIndex === 0 || !anyVideoPaused) {
      setIsPaused(false);
    }
  }, []);

  const onSelect = useCallback(
    (api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrent(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
      pauseInactiveVideos(api);
    },
    [pauseInactiveVideos],
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (to: number) => {
      api?.scrollTo(to);
    },
    [api],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect, pauseInactiveVideos]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        current,
        isPaused,
        slideCount,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};
