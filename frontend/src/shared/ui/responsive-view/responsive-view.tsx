'use client';

import { type ReactNode } from 'react';

import {
  type MediaQueries,
  useMatchMedia,
} from '@/shared/lib/hooks/useMatchMedia';

type Renderable = ReactNode | (() => ReactNode);

interface ResponsiveViewProps {
  mobile?: Renderable;
  tablet?: Renderable;
  desktop?: Renderable;
  render?: (media: MediaQueries) => Renderable;
  skeleton?: ReactNode;
  mobileSkeleton?: ReactNode;
  tabletSkeleton?: ReactNode;
  desktopSkeleton?: ReactNode;
}

const renderSlot = (slot: Renderable): ReactNode => {
  return typeof slot === 'function' ? slot() : slot;
};

export function ResponsiveView({
  mobile,
  tablet,
  desktop,
  render,
  skeleton = null,
  mobileSkeleton,
  tabletSkeleton,
  desktopSkeleton,
}: ResponsiveViewProps) {
  const media = useMatchMedia();

  if (media === null) {
    return <>{skeleton}</>;
  }

  if (media === null) {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 768 && mobileSkeleton) {
        return <>{mobileSkeleton}</>;
      }
      if (w >= 768 && w < 1280 && tabletSkeleton) {
        return <>{tabletSkeleton}</>;
      }
      if (w >= 1280 && desktopSkeleton) {
        return <>{desktopSkeleton}</>;
      }
    }

    return <>{skeleton ?? desktopSkeleton ?? null}</>;
  }

  if (render) {
    const customContent = render(media);
    return <>{renderSlot(customContent)}</>;
  }

  if (media.isMobile && mobile) {
    return <>{renderSlot(mobile)}</>;
  }

  if (media.isTablet && tablet) {
    return <>{renderSlot(tablet)}</>;
  }

  if (media.isDesktop && desktop) {
    return <>{renderSlot(desktop)}</>;
  }

  const fallback = desktop ?? tablet ?? mobile;
  return <>{fallback ? renderSlot(fallback) : skeleton}</>;
}

// Example 1
// import { ResponsiveView } from '@/components/ResponsiveView';
// import { DrawerNavigation } from '@/components/DrawerNavigation';
// import { DesktopHeader } from '@/components/DesktopHeader';

// export function Header() {
//   return (
//     <ResponsiveView
//       // Mobile phone and tablet share one UI (Drawer Navigation)
//       mobile={() => <DrawerNavigation />}
//       tablet={() => <DrawerNavigation />}
//       desktop={() => <DesktopHeader />}
//     />
//   );
// }

// Example 2
// import { ResponsiveView } from '@/components/ResponsiveView';
// import { ProductMobileSlider } from '@/components/ProductMobileSlider';
// import { ProductGridStandard } from '@/components/ProductGridStandard';
// import { ProductGridUltraWide } from '@/components/ProductGridUltraWide';

// export function ProductCatalogSection({ products }: { products: Product[] }) {
//   return (
//     <ResponsiveView
//       render={media => {
//         // 1. For mobile phones - slide/slider
//         if (media.isMobile) {
//           return <ProductMobileSlider items={products} />;
//         }

//         // 2. For large screens (1440px+) — 5 columns + side filters
//         if (media.is3XL) {
//           return (
//             <ProductGridUltraWide items={products} columns={5} showSidebar />
//           );
//         }

//         // 3. For desktops and tablets (default) — 3 columns
//         return <ProductGridStandard items={products} columns={3} />;
//       }}
//     />
//   );
// }

//Example 3
// 'use client';

// import dynamic from 'next/dynamic';
// import { ResponsiveView } from '@/components/ResponsiveView';
// import { StandardCatalog } from '@/components/StandardCatalog';

// // Lazy loading heavy mobile slider
// const MobileCarousel = dynamic(() => import('@/components/MobileCarousel'), {
//   ssr: false,
// });

// export function MainBanner() {
//   return (
//     <ResponsiveView
//       render={media => {
//         // Mobile: dynamic import (JS is not downloaded to desktop)
//         if (media.isMobile) {
//           return <MobileCarousel />;
//         }

//         // Specific large extension (from 1366px)
//         if (media.is2XL) {
//           return <StandardCatalog variant="wide" showPromoBanner />;
//         }

//         // Tablets and standard desktops
//         return <StandardCatalog variant="compact" />;
//       }}
//     />
//   );
// }
