import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
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
            <ImageGridItem
              image={{
                src: '/images/home/gift-red-package-with-plate.png',
                alt: 'gift-red-package-with-plate',
              }}
              aspect="aspect-343/300"
              items={2}
            />
            <ImageGridItem
              image={{
                src: '/images/home/gift-black-package.png',
                alt: 'gift-black-package',
              }}
              aspect="aspect-343/300"
              items={2}
            />
          </Box>
        </Container>
      </Section>
    </>
  );
}
