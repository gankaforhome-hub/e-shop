'use client';

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

export type IndicatorType = 'dots' | 'progress' | 'both' | 'none';

interface IScrollableContainer {
  children: ReactNode;
  as?: ElementType | undefined;
  className?: string | undefined;
  scrollClassName?: string | undefined;
  indicatorType?: IndicatorType | undefined;
  gapClassName?: string | undefined;
  indicatorClassName?: string | undefined;
}

export function ScrollableContainer({
  children,
  as: Component = 'div',
  className,
  scrollClassName,
  indicatorType = 'dots',
  gapClassName = 'gap-3 sm:gap-4 lg:gap-6',
  indicatorClassName,
}: IScrollableContainer) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [dotsCount, setDotsCount] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(entries => {
      // We safely take the first element
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const { clientWidth, scrollWidth } = entry.target;
      const canScroll = scrollWidth > clientWidth + 4;

      setIsScrollable(canScroll);
      setDotsCount(canScroll ? Math.ceil(scrollWidth / clientWidth) : 0);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [children]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollPercent(0);
      setActiveIndex(0);
      return;
    }

    // Calculate progress in percentage (0-100)
    const currentProgress = (scrollLeft / maxScroll) * 100;
    setScrollPercent(Math.min(100, Math.max(0, currentProgress)));

    // Calculation of the active point
    if (dotsCount > 1) {
      const progress = scrollLeft / maxScroll;
      const index = Math.min(
        Math.round(progress * (dotsCount - 1)),
        dotsCount - 1,
      );
      setActiveIndex(index);
    }
  };

  const scrollToDot = (dotIndex: number) => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const { clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    const targetLeft = (maxScroll / Math.max(dotsCount - 1, 1)) * dotIndex;

    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  };

  const showDots =
    (indicatorType === 'dots' || indicatorType === 'both') && dotsCount > 1;
  const showProgress = indicatorType === 'progress' || indicatorType === 'both';

  return (
    <div className={cn('w-full min-w-0', className)}>
      <Component
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          'scrollbar-none flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto py-2',
          gapClassName,
          !isScrollable ? 'justify-center' : 'justify-start',
          scrollClassName,
        )}
      >
        {children}
      </Component>

      {isScrollable && (
        <div
          className={cn(
            'mt-4 flex flex-col items-center gap-3',
            indicatorClassName,
          )}
        >
          {/* Dots */}
          {showDots && (
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: dotsCount }).map((_, index) => (
                <Button
                  variant="dotSecondary"
                  size="dots"
                  key={index}
                  onClick={() => scrollToDot(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  data-active={activeIndex === index}
                />
              ))}
            </div>
          )}

          {/* Progress bar */}
          {showProgress && (
            <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="bg-accent h-full rounded-full transition-transform duration-150 ease-out"
                style={{
                  // Slider width based on the number of child elements or pages
                  width: `${100 / Math.max(dotsCount || Children.count(children), 1)}%`,
                  // Exact offset in % of the slider's own width
                  transform: `translateX(${
                    (scrollPercent / 100) *
                    (Math.max(dotsCount || Children.count(children), 1) - 1) *
                    100
                  }%)`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
