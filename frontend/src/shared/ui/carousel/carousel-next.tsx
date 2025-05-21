import { ComponentProps, FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

export const CarouselNext: FC<ComponentProps<typeof Button>> = ({
  className,
  variant = 'outline',
  size = 'icon',
  children,
  ...props
}) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        'absolute h-full w-full rotate-180',
        orientation === 'horizontal'
          ? 'top-1/2 -translate-y-1/2'
          : '-bottom-2 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {children}
      <span className="sr-only">Next slide</span>
    </Button>
  );
};
