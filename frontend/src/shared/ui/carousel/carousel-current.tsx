import { type ComponentProps, type FC } from 'react';

import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

interface ICarouselCurrentProps extends ComponentProps<typeof Button> {
  to: number;
}

export const CarouselCurrent: FC<ICarouselCurrentProps> = ({
  className,
  variant = 'icon',
  size = 'icon',
  to = 1,
  children,
  ...props
}) => {
  const { scrollTo, current } = useCarousel();

  return (
    <Button
      data-slot="carousel-current"
      variant={variant}
      size={size}
      className={className}
      disabled={to === current}
      onClick={() => scrollTo(to)}
      {...props}
    >
      {children}
    </Button>
  );
};
