'use client';

import { Children, type ReactNode, useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface IMobileSliderWrapper {
  children: ReactNode;
  className?: string;
  classNameProgress?: string;
}

export function MobileSliderWrapperWithProgressBar({
  children,
  className,
  classNameProgress,
}: IMobileSliderWrapper) {
  const totalItems = Children.count(children);
  const thumbWidthPercent = 100 / Math.max(totalItems, 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const totalScroll = scrollWidth - clientWidth;

    if (totalScroll > 0) {
      const currentProgress = (scrollLeft / totalScroll) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    }
  };

  // const thumbWidthPercent = totalItems > 0 ? 100 / totalItems : 100;

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          'scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4',
          className,
        )}
      >
        {children}
      </div>

      <div className={cn('mt-2 px-4 sm:hidden', classNameProgress)}>
        <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-accent duration-250 h-full rounded-full transition-transform ease-out"
            style={{
              width: `${thumbWidthPercent}%`,
              transform: `translateX(${(progress / 100) * (totalItems - 1) * 100}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
