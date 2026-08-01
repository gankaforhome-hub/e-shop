import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface ICreatingGankaSection {
  className?: string;
}

export function CreatingGankaSection({ className }: ICreatingGankaSection) {
  return (
    <>
      <Section className={cn('', className)}>
        <Container>
          <Heading headingLevel="h2" className="fmb-6/16 text-center">
            Creating Ganka
          </Heading>

          <Box
            className={cn(
              'grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3',
            )}
          >
            <ImageGridItem
              image={{
                src: '/images/home/creating-ganka-horse.webp',
                alt: 'Creating Ganka Horse',
              }}
              aspect="aspect-square"
              items={3}
              className="h-full w-full"
            />

            <Box
              className={cn(
                'bg-muted flex h-full min-h-80 w-full flex-col items-center justify-center rounded-lg p-6 text-center md:aspect-auto md:p-10',
                // 'bg-surface-muted min-h-75 aspect-343/331 flex flex-col items-center justify-between rounded-lg p-6 text-center md:aspect-auto md:h-full md:p-8 lg:p-10',
              )}
            >
              <Box className="flex max-w-[90%] flex-col items-center justify-center gap-4">
                <Text className="text-text-primary font-heading text-base font-normal leading-snug tracking-widest sm:text-lg lg:text-xl">
                  Introducing New collection-Winter 2025/2026
                </Text>

                <Text className="text-text-primary font-heading mb-6 text-sm leading-relaxed sm:text-base">
                  Table service{' '}
                  <span className="text-accent-foreground font-medium">
                    Konyushina
                  </span>{' '}
                  Release Date 01/01/2026
                </Text>
              </Box>

              <Button asChild className="max-md:min-w-50">
                <AppLink href={routes.releases}>Pre-order</AppLink>
              </Button>
            </Box>

            <ImageGridItem
              image={{
                src: '/images/home/creating-ganka-plate-on-table.webp',
                alt: 'Creating Ganka Plate on table',
              }}
              aspect="aspect-square md:aspect-auto"
              items={3}
              className="h-full w-full md:hidden xl:block"
            />
          </Box>
        </Container>
      </Section>
    </>
  );
}
