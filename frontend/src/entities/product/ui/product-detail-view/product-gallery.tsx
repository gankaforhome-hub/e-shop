'use client';

import { useEffect, useRef } from 'react';

import { cn } from 'cn';

import { AppMedia } from '@/shared/ui/app-media';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';
import { Icon } from '@/shared/ui/icon';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';
import { BannerPagination } from '@/widgets/sections/home/hero/ui/banner-pagination';

import { type ProductMedia } from '../../model/types';

interface ProductGalleryProps {
  media: ProductMedia[];
  title: string;
  activeMediaId: string;
}

// export function ProductGallery({
//   media,
//   title,
//   activeMediaId,
// }: ProductGalleryProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const activeMedia = media.find(m => m.id === activeMediaId) || media[0];

//   const handleSelectMedia = (id: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('media', id);
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   return (
//     <div className="flex flex-col gap-4 lg:col-span-7 lg:flex-row">
//       <div className="bg-muted relative aspect-square w-full overflow-hidden lg:order-2">
//         {activeMedia && (
//           <AppMedia
//             src={activeMedia.src}
//             alt={title}
//             fill
//             loading="eager"
//             className={`object-${activeMedia.objectFit} duration-(--dur-slow) transition-all`}
//             sizes="(max-width: 1024px) 100vw, 50vw"
//           />
//         )}
//       </div>

//       <div className="flex shrink-0 gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
//         {media.map(mediaItem => {
//           const isActive = mediaItem.id === activeMedia?.id;
//           return (
//             <button
//               key={mediaItem.id}
//               onClick={() => handleSelectMedia(mediaItem.id)}
//               className={cn(
//                 'duration-(--dur-norm) relative size-16 shrink-0 cursor-pointer overflow-hidden transition-all sm:size-20 md:size-24',
//                 isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80',
//               )}
//             >
//               <AppMedia
//                 src={mediaItem.src}
//                 alt={title}
//                 fill
//                 className={`object-${mediaItem.objectFit}`}
//                 sizes="96px"
//               />
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

function ProductGalleryContent({
  media,
  title,
  activeMediaId,
}: ProductGalleryProps) {
  const { api, current, scrollTo } = useCarousel();
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isSingleMedia = media.length <= 1;

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
                alt={`${title} - ${index + 1}`}
                width={800}
                height={800}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                className="h-full w-full select-none object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center gap-2">
          {media.map((_, idx) => (
            <BannerPagination key={idx} to={idx} />
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
                      onMouseEnter={() => scrollTo(index)}
                      onFocus={() => scrollTo(index)}
                      className={cn(
                        'relative aspect-square h-16 w-16 shrink-0 border transition-colors duration-150 sm:h-20 sm:w-20',
                        isSelected ? 'border-brand' : 'border-transparent',
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <AppMedia
                        src={item.src}
                        alt={`Thumbnail ${index + 1}`}
                        width={150}
                        height={150}
                        sizes="(max-width: 640px) 64px, 80px"
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
