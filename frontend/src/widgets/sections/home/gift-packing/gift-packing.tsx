import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

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
          <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:gap-6">
            <ImageGridItem
              image={{
                src: '/images/home/gift-red-package-with-plate.png',
                alt: 'gift-red-package-with-plate',
              }}
              aspect="aspect-343/300"
              items={2}
            />
            <Box
              className={cn(
                'aspect-343/300 bg-surface-muted flex flex-col items-center justify-center rounded-lg p-6 text-center',
                'md:sr-only',
              )}
            >
              <Text className="text-text-secondary text-sm leading-relaxed">
                Ukrainian artist Ganka Tretyak transferred her rich artistic
                experience to the new homeware project Ganka for Home. Ganka for
                Home collections will bring a festive atmosphere and warmth to
                your home...
              </Text>
            </Box>
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
