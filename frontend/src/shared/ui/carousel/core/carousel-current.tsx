import { type ComponentProps, type FC } from 'react';

import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

interface ICarouselCurrentProps extends ComponentProps<typeof Button> {
  to: number;
  animateScroll?: boolean | undefined;
}

export const CarouselCurrent: FC<ICarouselCurrentProps> = ({
  className,
  variant = 'dot',
  size = 'dots',
  to = 1,
  children,
  animateScroll = undefined,
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
      onClick={() => scrollTo(to, animateScroll)}
      {...props}
    >
      {children}
    </Button>
  );
};
