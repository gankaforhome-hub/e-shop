'use client';

import { useRef, useState } from 'react';

interface IMobileSliderWrapper {
  children: React.ReactNode;
  totalItems: number;
}

export function MobileSliderWrapperWithProgressBar({
  children,
  totalItems,
}: IMobileSliderWrapper) {
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

  const thumbWidthPercent = totalItems > 0 ? 100 / totalItems : 100;

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
      >
        {children}
      </div>

      <div className="mt-2 px-4 sm:hidden">
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
