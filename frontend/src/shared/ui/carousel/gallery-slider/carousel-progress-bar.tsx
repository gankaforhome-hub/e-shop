'use client';

import { cn } from '@/shared/lib/utils';

import { useCarousel } from '../core/useCarousel';

interface ICarouselProgressBarProps {
  totalSlides: number;
  classNameCarouselProgressBar?: string;
}

export function CarouselProgressBar({
  totalSlides,
  classNameCarouselProgressBar,
}: ICarouselProgressBarProps) {
  const { current } = useCarousel();

  const progress = totalSlides <= 1 ? 100 : ((current + 1) / totalSlides) * 100;

  return (
    <div className={cn('px-4 py-3', classNameCarouselProgressBar)}>
      <div className="bg-foreground/10 h-px w-full overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
