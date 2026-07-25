'use client';

import { useEffect, useState, type ReactNode } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
interface IResponsiveView {
  mobileView: ReactNode;
  desktopView: ReactNode;
  skeleton?: ReactNode;
}

export function ResponsiveView({
  mobileView,
  desktopView,
  skeleton,
}: IResponsiveView) {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return <>{skeleton}</>;
  }

  return <>{isMobile ? mobileView : desktopView}</>;
}
