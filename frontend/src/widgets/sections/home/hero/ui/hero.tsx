import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

import { BannerSlider } from './banner-slider';

export const Hero = () => {
  return (
    <Section>
      <Container className="relative overflow-hidden">
        <Box className="block h-[calc(90vh-var(--h-mob-header))] sm:hidden" />
        <Heading headingLevel="h1" className="visually-hidden">
          Ganka for home
        </Heading>

        <BannerSlider className="z-10 w-screen sm:static sm:w-full" />

        <Box
          className={cn(
            'absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-end uppercase',
          )}
        >
          <Text variant="secondary">new collection</Text>
          <Heading
            headingLevel="h2"
            tone="secondary"
            className="text-5xl font-bold tracking-widest"
          >
            konyushina
          </Heading>
          <Button asChild variant="default" size="default" className="mt-4">
            <Link href="/components">View Collection</Link>
          </Button>
        </Box>
      </Container>
    </Section>
  );
};
