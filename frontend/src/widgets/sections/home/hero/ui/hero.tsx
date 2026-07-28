import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { BannerSlider } from './banner-slider';

// import { BannerSlider } from './banner-slider';

export const Hero = () => {
  return (
    <Section className="overflow-hidden">
      <Container>
        <Heading headingLevel="h1" className="visually-hidden">
          Ganka for home
        </Heading>
      </Container>
      <BannerSlider
        className={cn(
          'w-full touch-pan-y overscroll-none', // 👈 Блокує rubber-band ефект у мобільних браузерах
          'h-[calc(640px-var(--h-topbar))]',
          'landscape:max-md:h-80',
          'md:h-[calc(100dvh-var(--h-topbar))]',
        )}
      />
    </Section>
  );
};
