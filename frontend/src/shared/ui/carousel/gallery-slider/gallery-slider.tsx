import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { Carousel, type ICarousel } from '../core/carousel';
import { CarouselContent } from '../core/carousel-content';
import { CarouselItem } from '../core/carousel-item';

import { CarouselProgressBar } from './carousel-progress-bar';

interface IGallerySliderProps<T> extends ICarousel {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  classNameItem?: string;
  paginationPlacement?: 'top' | 'bottom' | 'none';
  isOpacityTween?: boolean;
}

export function GallerySlider<T>({
  items,
  renderItem,
  className,
  paginationPlacement = 'bottom',
  classNameItem,

  ...props
}: IGallerySliderProps<T>) {
  return (
    <Carousel
      opts={{
        align: 'center',
      }}
      className={cn('w-full', className)}
      {...props}
    >
      <CarouselContent className="-ml-1 sm:-ml-5">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn('ml-1 px-2 sm:ml-5', classNameItem)}
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      {paginationPlacement === 'bottom' && (
        <CarouselProgressBar totalSlides={items.length} />
      )}
    </Carousel>
  );
}
