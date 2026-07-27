import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { BannerSlider } from './banner-slider';

// import { BannerSlider } from './banner-slider';

export const Hero = () => {
  return (
    <Section>
      <Container className="relative overflow-hidden">
        <Box className="block h-[calc(100vh-var(--h-topbar))] md:hidden" />
        <Heading headingLevel="h1" className="visually-hidden">
          Ganka for home
        </Heading>
      </Container>
      <BannerSlider className="w-full" />
    </Section>
  );
};
