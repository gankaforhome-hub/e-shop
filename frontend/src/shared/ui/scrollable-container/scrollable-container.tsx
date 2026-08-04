'use client';

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

export type IndicatorType = 'dots' | 'progress' | 'both' | 'none';

interface IScrollableContainer<T extends ElementType = 'div'> {
  children: ReactNode;
  as?: T;
  className?: string;
  scrollClassName?: string;
  indicatorType?: IndicatorType;
  gapClassName?: string;
  indicatorClassName?: string;
}

export function ScrollableContainer<T extends ElementType = 'div'>({
  children,
  as,
  className,
  scrollClassName,
  indicatorType = 'dots',
  gapClassName = 'gap-3 sm:gap-4 lg:gap-6',
  indicatorClassName,
  ...props
}: IScrollableContainer<T> &
  Omit<ComponentPropsWithRef<T>, keyof IScrollableContainer<T>>) {
  const Component = as || 'div';
  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // 1. Рахуємо кількість елементів для SSR
  const totalItems = Children.count(children);

  // 2. Оцінка крапок для серверного HTML (щоб рендерилися ВІДРАЗУ без затримки на JS)
  const initialDots =
    totalItems > 1 ? Math.max(2, Math.ceil(totalItems / 2)) : 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrollable, setIsScrollable] = useState(totalItems > 1);
  const [dotsCount, setDotsCount] = useState(initialDots);

  const updateLayoutMetrics = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const { clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 1) {
      setIsScrollable(false);
      setDotsCount(0);
      return;
    }

    setIsScrollable(true);
    const count = Math.max(1, Math.ceil(scrollWidth / clientWidth));
    setDotsCount(count);
  }, []);

  const updateScrollProgress = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 1) {
      return;
    }

    const clampedScrollLeft = Math.min(maxScroll, Math.max(0, scrollLeft));
    const currentProgress = (clampedScrollLeft / maxScroll) * 100;
    setScrollPercent(currentProgress);

    setDotsCount(currentDotsCount => {
      if (currentDotsCount > 1) {
        const isAtEnd = maxScroll - clampedScrollLeft < 5;

        if (isAtEnd) {
          setActiveIndex(currentDotsCount - 1);
        } else {
          const progressRatio = clampedScrollLeft / maxScroll;
          const index = Math.min(
            Math.round(progressRatio * (currentDotsCount - 1)),
            currentDotsCount - 1,
          );
          setActiveIndex(index);
        }
      }
      return currentDotsCount;
    });
  }, []);

  const handleScroll = () => {
    if (animFrameId.current !== null) {
      cancelAnimationFrame(animFrameId.current);
    }
    animFrameId.current = requestAnimationFrame(updateScrollProgress);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    updateLayoutMetrics();
    updateScrollProgress();

    const resizeObserver = new ResizeObserver(() => {
      updateLayoutMetrics();
      updateScrollProgress();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [updateLayoutMetrics, updateScrollProgress, children]);

  const scrollToDot = (dotIndex: number) => {
    const container = scrollRef.current;
    if (!container || dotsCount <= 1) {
      return;
    }

    const { clientWidth, scrollWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    // Захист від ділення на нуль
    const divisor = Math.max(dotsCount - 1, 1);
    const targetLeft = (maxScroll / divisor) * dotIndex;

    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  };

  const showDots =
    (indicatorType === 'dots' || indicatorType === 'both') && dotsCount > 1;
  const showProgress = indicatorType === 'progress' || indicatorType === 'both';

  const progressMultiplier = Math.max(dotsCount, 1);
  const translateOffset =
    (scrollPercent / 100) * (progressMultiplier - 1) * 100;

  return (
    <div className={cn('w-full min-w-0', className)}>
      <Component
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          'scrollbar-none flex w-full min-w-0 touch-pan-x snap-x snap-mandatory flex-nowrap justify-start overflow-x-auto py-2',
          gapClassName,
          scrollClassName,
        )}
        {...props}
      >
        {children}
      </Component>

      {isScrollable && (
        <div
          suppressHydrationWarning
          className={cn(
            'mt-4 flex h-6 items-center justify-center gap-3',
            indicatorClassName,
          )}
        >
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

          {showProgress && (
            <div className="bg-dot-inactive-secondary relative h-0.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-dot-active-secondary h-full rounded-full transition-transform duration-75 ease-out"
                style={{
                  width: `${100 / progressMultiplier}%`,
                  transform: `translate3d(${translateOffset.toFixed(2)}%, 0, 0)`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
