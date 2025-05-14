import { ComponentProps, FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

interface ICarouselCurrentProps extends ComponentProps<typeof Button> {
  to: number;
}

export const CarouselCurrent: FC<ICarouselCurrentProps> = ({
  className,
  variant = 'outline',
  size = 'icon',
  to = 1,
  children,
  ...props
}) => {
  const { scrollTo } = useCarousel();

  return (
    <Button
      data-slot="carousel-current"
      variant={variant}
      size={size}
      className={cn(
        'absolute size-10 h-5 w-5 rounded-full bg-amber-400',
        // orientation === 'horizontal'
        //   ? '-left-2 top-1/2 -translate-y-1/2'
        //   : '-top-2 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      // disabled={!canScrollPrev}
      onClick={() => scrollTo(to)}
      {...props}
    >
      {children}
    </Button>
  );
};
