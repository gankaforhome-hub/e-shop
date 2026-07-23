import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface IGiftPackingSection {
  className?: string;
}

export function GiftPackingSection({ className }: IGiftPackingSection) {
  return (
    <>
      <Section className={cn('', className)}>
        <Container>
          <Heading headingLevel="h2" className="fmb-6/16 text-center">
            Gift Packing
          </Heading>
          <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            <Box className="aspect-343/300 relative overflow-hidden">
              <AppMedia
                src={'/images/home/gift-red-package-with-plate.png'}
                alt={'gift-red-package-with-plate'}
                className="rounded-card"
                fill
                sizes={'(min-width: 768px) 45vw, 95vw'}
              />
            </Box>
            <Box className="aspect-343/300 relative overflow-hidden">
              <AppMedia
                src={'/images/home/gift-black-package.png'}
                alt={'gift-black-package'}
                className="rounded-card"
                fill
                sizes={'(max-width: 768px) 95vw, 45vw'}
              />
            </Box>
          </Box>
        </Container>
      </Section>
    </>
  );
}
