'use client';

import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PropsWithChildren,
} from 'react';

import { cn } from '@/shared/lib/utils';

import { type CarouselApi, type CarouselProps } from './types';
import { CarouselContext } from './useCarousel';

export interface ICarouselProps extends PropsWithChildren<
  CarouselProps & { className?: string; isOpacityTween?: boolean }
> {}
export function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  isAutoplay = false,
  isFade = false,
  isOpacityTween = false,
  className,
  children,
  ...props
}: ICarouselProps) {
  const mergedPlugins = useMemo(() => {
    const res = [...(plugins ?? [])];
    if (isAutoplay) {
      res.push(Autoplay({ delay: 4000, stopOnInteraction: false }));
    }
    if (isFade) {
      res.push(Fade());
    }
    return res;
  }, [plugins, isAutoplay, isFade]);

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
  const [isInitialize, setIsInitialize] = useState(false);
  const tweenFactor = useRef(0);

  const pauseInactiveVideos = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }
    const currentIndex = api.selectedScrollSnap();
    const slideNodes = api.slideNodes();

    let anyVideoPaused = false;

    slideNodes.forEach((slide, index) => {
      if (index !== currentIndex) {
        const videos = slide.querySelectorAll('video');
        videos.forEach(video => {
          if (!video.paused) {
            video.pause();
            anyVideoPaused = true;
          }
        });
      }
    });

    if (currentIndex === 0 || !anyVideoPaused) {
      setIsPaused(false);
    }
  }, []);

  const tweenOpacity = useCallback((api: CarouselApi, eventName?: string) => {
    if (!api) {
      return;
    }

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    api.scrollSnapList().forEach((snap, snapIndex) => {
      let diffToTarget = snap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      if (slidesInSnap) {
        slidesInSnap.forEach(slideIndex => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) {
            return;
          }

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach(loopItem => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget = snap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = snap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const opacity = Math.max(0, Math.min(1, tweenValue)).toString();
          const slideNode = api.slideNodes()[slideIndex];
          if (slideNode) {
            slideNode.style.opacity = opacity;
          }
        });
      }
    });
  }, []);

  const onSelect = useCallback(
    (api: CarouselApi) => {
      if (!api) {
        return;
      }
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrent(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
      pauseInactiveVideos(api);
      setIsInitialize(true);
    },
    [pauseInactiveVideos],
  );

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = useCallback(
    (to: number, animate?: boolean) => api?.scrollTo(to, animate),
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
    if (!api || !setApi) {
      return;
    }
    setApi(api);
  }, [api, setApi]);

  // 4. Cleanup усіх Embla подій
  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('reInit', onSelect);
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || !isOpacityTween) {
      return;
    }

    const TWEEN_FACTOR_BASE = 0.52;
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
    tweenOpacity(api);

    api.on('scroll', tweenOpacity);
    api.on('reInit', tweenOpacity);
    api.on('slideFocus', tweenOpacity);

    return () => {
      api.off('scroll', tweenOpacity);
      api.off('reInit', tweenOpacity);
      api.off('slideFocus', tweenOpacity);
    };
  }, [api, isOpacityTween, tweenOpacity]);

  const contextValue = useMemo(
    () => ({
      carouselRef,
      api,
      opts,
      orientation:
        orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      current,
      isInitialize,
      isPaused,
      slideCount,
      isAutoplay,
      isFade,
    }),
    [
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      current,
      isInitialize,
      isPaused,
      slideCount,
      isAutoplay,
      isFade,
    ],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
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
}
