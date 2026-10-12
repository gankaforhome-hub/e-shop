'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import {
  Carousel,
  CarouselContent,
  CarouselCurrent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/shared/ui/carousel';
import { Icon } from '@/shared/ui/icon';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';

import { type ProductMedia } from '../../model/types';

interface ProductGalleryProps {
  media: ProductMedia[];
  title: string;
  activeMediaId: string;
}

function ProductGalleryContent({
  media,
  title,
  activeMediaId,
}: ProductGalleryProps) {
  const { api, current, scrollTo } = useCarousel();
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isSingleMedia = media.length <= 1;
  // The slide visible on first paint is the LCP candidate
  const initialIndex = Math.max(
    0,
    media.findIndex(item => item.id === activeMediaId),
  );

  // Реакція на зміну варіанта з сервера (зміна activeMediaId)
  useEffect(() => {
    if (!api || !activeMediaId) {
      return;
    }

    const targetIndex = media.findIndex(item => item.id === activeMediaId);
    if (targetIndex !== -1 && targetIndex !== api.selectedScrollSnap()) {
      api.scrollTo(targetIndex, true);
    }
  }, [api, activeMediaId, media]);

  // Автоскрол активної мініатюри
  useEffect(() => {
    const activeThumb = thumbRefs.current[current];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [current]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
      {/* Основна картинка */}
      <div className="relative w-full min-w-0 lg:order-2 lg:flex-1">
        <CarouselContent>
          {media.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="relative aspect-square w-full pl-0"
            >
              <AppMedia
                src={item.src}
                alt={item.alt || `${title} - ${index + 1}`}
                fill
                loading={index === initialIndex ? 'eager' : 'lazy'}
                fetchPriority={index === initialIndex ? 'high' : 'auto'}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full select-none object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-2">
          {media.map((_, idx) => (
            <CarouselCurrent key={idx} to={idx} />
          ))}
        </div>
        {!isSingleMedia && (
          <>
            <CarouselPrevious className="max-md:hidden">
              <Icon name="chevron-left" className="size-4" />
            </CarouselPrevious>
            <CarouselNext className="max-md:hidden">
              <Icon name="chevron-right" className="size-4" />
            </CarouselNext>
          </>
        )}
      </div>

      {/* Колонки мініатюр */}
      {!isSingleMedia && (
        <div className="relative shrink-0 overflow-hidden max-lg:hidden lg:order-1 lg:w-20 lg:self-stretch">
          <div className="absolute inset-0 flex flex-col">
            <ScrollableContainer
              as="ul"
              indicatorType="none"
              gapClassName="gap-2 sm:gap-3 lg:flex-col"
              indicatorClassName="m-2"
              scrollClassName="h-full min-h-0 lg:flex-col"
            >
              {media.map((item, index) => {
                const isSelected = current === index;
                return (
                  <li key={item.id}>
                    <button
                      ref={el => {
                        thumbRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => scrollTo(index)}
                      aria-current={isSelected ? 'true' : undefined}
                      className={cn(
                        'focus-visible:ring-ring duration-(--dur-fast) relative aspect-square h-16 w-16 shrink-0 border outline-none transition-[border-color,opacity] focus-visible:ring-2 sm:h-20 sm:w-20',
                        isSelected
                          ? 'border-brand'
                          : 'border-transparent opacity-80 hover:opacity-100',
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <AppMedia
                        src={item.src}
                        alt=""
                        width={80}
                        height={80}
                        sizes="80px"
                        className="h-full w-full select-none object-cover"
                      />
                    </button>
                  </li>
                );
              })}
            </ScrollableContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductGallery(props: ProductGalleryProps) {
  const { media, activeMediaId } = props;

  if (!media.length) {
    return null;
  }

  const initialIndex = activeMediaId
    ? Math.max(
        0,
        media.findIndex(item => item.id === activeMediaId),
      )
    : 0;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 lg:col-span-7">
      <Carousel
        className="relative z-10 h-full w-full"
        opts={{
          startIndex: initialIndex,
          align: 'start',
          containScroll: 'trimSnaps',
          loop: false,
          duration: 25,
        }}
      >
        <ProductGalleryContent {...props} />
      </Carousel>
    </div>
  );
}
