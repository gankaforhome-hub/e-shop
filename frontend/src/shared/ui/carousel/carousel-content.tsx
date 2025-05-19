import { ComponentProps, FC } from 'react';

import { cn } from '@/shared/lib/utils';

import { useCarousel } from './useCarousel';

export const CarouselContent: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'ml-0' : 'mt-0 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
};
