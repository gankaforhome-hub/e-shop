import { type ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { useCarousel } from './useCarousel';

interface CarouselNextProps extends ComponentProps<typeof Button> {
  /** Accessible name (localized by the caller), e.g. "Next slide". */
  label: string;
}

export function CarouselNext({
  className,
  variant = 'outline',
  size = 'icon',
  label,
  children,
  ...props
}: CarouselNextProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        'bg-background/60 hover:bg-background/80 absolute z-10 size-8 rounded-full border-white/20 shadow-sm backdrop-blur-sm',
        orientation === 'horizontal'
          ? 'right-3 top-1/2 -translate-y-1/2'
          : 'bottom-3 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
