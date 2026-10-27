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
    // lg+: rail 1fr / main 5.5fr, so ~5 thumbnails fill the main image height
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,5.5fr)] lg:gap-6 xl:gap-8">
      {/* Основна картинка */}
      <div
        className={cn(
          'relative w-full min-w-0 lg:order-2 lg:self-start',
          isSingleMedia && 'lg:col-span-2',
        )}
      >
        <CarouselContent>
          {media.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="relative aspect-square w-full rounded-none pl-0"
            >
              <AppMedia
                src={item.src}
                alt={item.alt || `${title} - ${index + 1}`}
                fill
                loading={index === initialIndex ? 'eager' : 'lazy'}
                fetchPriority={index === initialIndex ? 'high' : 'auto'}
                sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
                className="h-full w-full select-none rounded-none object-cover"
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
        <div className="relative min-w-0 overflow-hidden max-lg:hidden lg:order-1 lg:self-stretch">
          <div className="absolute inset-0 flex flex-col">
            <ScrollableContainer
              as="ul"
              indicatorType="none"
              gapClassName="gap-2 sm:gap-3 lg:flex-col"
              indicatorClassName="m-2"
              // Top-aligned with the main image; focus ring is inset instead
              scrollClassName="h-full min-h-0 lg:flex-col lg:py-0"
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
                        'focus-visible:ring-ring duration-(--dur-fast) relative block aspect-square w-full shrink-0 rounded-none border outline-none transition-[border-color,opacity] focus-visible:ring-2 focus-visible:ring-inset',
                        isSelected
                          ? 'border-brand'
                          : 'border-transparent opacity-80 hover:opacity-100',
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <AppMedia
                        src={item.src}
                        alt=""
                        fill
                        sizes="(min-width: 1536px) 160px, (min-width: 1280px) 128px, 100px"
                        className="h-full w-full select-none rounded-none object-cover"
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
    // Dims while the sidebar is switching to another variant's gallery
    <div className="duration-(--dur-normal) flex w-full min-w-0 flex-col gap-3 transition-opacity group-has-[[data-variant-pending]]/pdp:opacity-60">
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
