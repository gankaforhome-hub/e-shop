import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/ui/section';

import { type TBannerSlide } from './model/types';
import { BannerSlider } from './ui/banner-slider';

interface HeroProps {
  bannerSlides: TBannerSlide[];
  ctaLabel: string;
}

export function Hero({ bannerSlides = [], ctaLabel }: HeroProps) {
  return (
    <Section className="overflow-hidden" spacing="none">
      <BannerSlider
        bannerSlides={bannerSlides}
        ctaLabel={ctaLabel}
        className={cn(
          'md:aspect-21/9 relative aspect-video h-[calc(640px-var(--h-header-mobile))] w-full md:h-[calc(100dvh-var(--h-header-tab))] lg:h-[calc(100dvh-var(--h-header-desktop))] landscape:max-md:h-80',
          'touch-pan-y overscroll-none',
        )}
      />
    </Section>
  );
}
