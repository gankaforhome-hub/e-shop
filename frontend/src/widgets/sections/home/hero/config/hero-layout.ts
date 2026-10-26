import { cn } from '@/shared/lib/utils';

/**
 * Hero height shared by `Hero` and `BannerSliderSkeleton` (zero CLS).
 * `svh` stays fixed while the mobile URL bar collapses (no resize on scroll);
 * `--h-hero-peek` keeps the top of the next section above the fold.
 */
export const HERO_HEIGHT = cn(
  'min-h-80 h-[min(calc(640px-var(--h-header-mobile)),calc(100svh-var(--h-header-mobile)-var(--h-hero-peek)))]',
  'md:h-[calc(100svh-var(--h-header-tab)-var(--h-hero-peek))]',
  'lg:h-[calc(100svh-var(--h-header-desktop)-var(--h-hero-peek))]',
  'landscape:max-md:h-80',
);
