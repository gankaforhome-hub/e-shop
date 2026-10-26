import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/ui/section';

import { HERO_HEIGHT } from './config/hero-layout';
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
          'relative w-full',
          HERO_HEIGHT,
          'touch-pan-y overscroll-none',
        )}
      />
    </Section>
  );
}
