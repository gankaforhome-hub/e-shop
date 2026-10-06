import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

export function CarouselPrevious({
  className,
  variant = 'outline',
  size = 'icon',
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'bg-background/60 hover:bg-background/80 absolute z-10 size-8 rounded-full border border-white/20 shadow-sm backdrop-blur-sm',
        orientation === 'horizontal'
          ? 'left-3 top-1/2 -translate-y-1/2'
          : 'left-1/2 top-3 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {children}
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}
