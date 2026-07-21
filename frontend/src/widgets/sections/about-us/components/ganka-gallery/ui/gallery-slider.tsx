import Image from 'next/image';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { type ImageAsset } from '../../../api';

import { GalleryPagination } from './gallery-pagination';

interface IGallerySlider {
  images: ImageAsset[];
  className?: string;
  paginationPlacement?: 'top' | 'bottom' | 'none';
}

export function GallerySlider({
  images,
  className,
  paginationPlacement,
}: IGallerySlider) {
  console.log('🚀 ~ GallerySlider ~ paginationPlacement:', paginationPlacement);
  return (
    <Carousel
      opts={{
        loop: true,
        align: 'center',
        duration: 100,
      }}
      isOpacityTween
      className={cn('max-w-400 w-full', className)}
    >
      <CarouselContent className="-ml-1">
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className={cn(
              'relative aspect-square basis-full overflow-hidden rounded-xl pl-1 md:basis-2/3',
            )}
          >
            {/* Картинка слайда */}
            <Image
              src={image.src}
              alt={image.alt || `Slide ${index}`}
              fill
              sizes="(min-width: 640px) 33vw, (min-width: 768px) 66vw, 100vw"
              className="object-cover object-center" //transition-transform duration-300 hover:scale-105
            />

            {paginationPlacement === 'top' && (
              <Box className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2">
                <Box className="flex gap-3 rounded-full bg-white/10 p-2 backdrop-blur-md">
                  {images.map((_, idx) => (
                    <GalleryPagination key={idx} to={idx} />
                  ))}
                </Box>
              </Box>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>

      {paginationPlacement === 'bottom' && (
        <Box className="mt-5 hidden md:block">
          <Box className="flex justify-center gap-5 px-4 py-3">
            {images.map((_, idx) => (
              <GalleryPagination key={idx} to={idx} dotsType="secondary" />
            ))}
          </Box>
        </Box>
      )}
    </Carousel>
  );
}
