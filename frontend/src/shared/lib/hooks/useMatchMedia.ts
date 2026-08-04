// hooks/useMatchMedia.ts
'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

export interface MediaQueries {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  is2XL: boolean;
  is3XL: boolean;
}

const defaultQueries: MediaQueries = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isSM: false,
  isMD: false,
  isLG: false,
  isXL: false,
  is2XL: false,
  is3XL: false,
};

let cachedQueries: MediaQueries = defaultQueries;
let lastWidth: number | null = null;

function getSnapshot(): MediaQueries {
  if (typeof window === 'undefined') {
    return defaultQueries;
  }

  const width = window.innerWidth;

  if (width === lastWidth) {
    return cachedQueries;
  }

  lastWidth = width;
  cachedQueries = {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1280,
    isDesktop: width >= 1280,
    isSM: width >= 640,
    isMD: width >= 768,
    isLG: width >= 1024,
    isXL: width >= 1280,
    is2XL: width >= 1366,
    is3XL: width >= 1440,
  };

  return cachedQueries;
}

function subscribe(callback: () => void) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, 50);
  };

  window.addEventListener('resize', handleResize);
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
  };
}

function getServerSnapshot(): MediaQueries {
  return defaultQueries;
}

export function useMatchMedia() {
  const media = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? media : null;
}
