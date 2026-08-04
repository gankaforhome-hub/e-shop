import { type ComponentProps } from 'react';

import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

interface ICarouselCurrentProps extends ComponentProps<typeof Button> {
  to: number;
  animateScroll?: boolean | undefined;
}

export function CarouselCurrent({
  className,
  variant = 'dot',
  size = 'dots',
  to = 1,
  children,
  animateScroll = undefined,
  ...props
}: ICarouselCurrentProps) {
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
}
