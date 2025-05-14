import { ComponentProps, FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

export const CarouselPrevious: FC<ComponentProps<typeof Button>> = ({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-2 top-1/2 -translate-y-1/2'
          : '-top-2 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      ArrowLeft
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};
