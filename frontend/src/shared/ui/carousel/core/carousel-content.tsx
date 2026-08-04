import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { useCarousel } from './useCarousel';

export function CarouselContent({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="h-full w-full overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex h-full w-full',
          orientation === 'horizontal' ? 'ml-0' : 'mt-0 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}
