import { FC, HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

import { useCarousel } from './useCarousel';

interface ICarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CarouselItem: FC<ICarouselItemProps> = ({
  className,
  ...props
}) => {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  );
};
