'use client';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { useCarousel } from '@/shared/ui/carousel/core/useCarousel';

interface ICarouselProgressBar {
  totalSlides: number;
  classNameCarouselProgressBar?: string;
}

export function CarouselProgressBar({
  totalSlides,
  classNameCarouselProgressBar,
}: ICarouselProgressBar) {
  const { current } = useCarousel();

  const progress = totalSlides <= 1 ? 100 : ((current + 1) / totalSlides) * 100;

  return (
    <Box className={cn('px-4 py-3', classNameCarouselProgressBar)}>
      <Box className="h-px w-full overflow-hidden rounded-full bg-black/10">
        <Box
          className="bg-accent h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </Box>
    </Box>
  );
}
