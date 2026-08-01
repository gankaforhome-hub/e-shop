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

interface IStayInTouchSection {
  className?: string;
}
export function StayInTouchSection({ className }: IStayInTouchSection) {
  return (
    <Section className={cn('', className)}>
      <Container>
        <Heading headingLevel="h2" className="fmb-6/16 text-center">
          Stay in Touch with Ganka
        </Heading>
        <Box
          className={cn(
            'grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {/* Перша картинка: на мобілці строго квадрат (aspect-square), на md: розтягується по висоті (md:aspect-auto md:h-full) */}
          <ImageGridItem
            image={{
              src: '/images/home/stay-in-touch-japan-girls-with-snake.webp',
              alt: 'stay-in-touch-japan-girls-with-snake',
            }}
            aspect="aspect-343/331 md:h-full"
            items={3}
          />
          <Box
            className={cn(
              'bg-muted flex h-full min-h-80 flex-col items-center justify-center rounded-lg p-6 md:aspect-auto xl:p-10',
              'max-sm:w-full',
            )}
          >
            <Box className="flex max-w-[90%] flex-col items-center gap-4">
              <Text className="text-accent-foreground text-center text-base font-semibold uppercase leading-tight tracking-widest lg:text-lg xl:text-xl">
                GANKA TRETYAK
              </Text>
              <Text className="text-foreground mb-6 text-sm leading-relaxed lg:text-center lg:text-base">
                Ukrainian artist Ganka Tretyak transferred her rich artistic
                experience to the new homeware project Ganka for Home. Ganka for
                Home collections will bring a festive atmosphere and warmth to
                your home...
              </Text>
            </Box>

            <Button asChild className="max-md:min-w-50">
              <AppLink href={routes.contacts}>See more</AppLink>
            </Button>
          </Box>

          {/* <Box
            className={cn(
              'bg-muted min-h-75 aspect-343/331 flex flex-col items-center justify-between rounded-lg p-6 text-center md:aspect-auto md:h-full md:p-8 lg:p-10',
            )}
          >
            <Box className="my-auto flex max-w-md flex-col items-center"></Box>

            <Button asChild className="mx-auto flex shrink-0">
              <AppLink href={routes.contacts}>See more</AppLink>
            </Button>
          </Box> */}

          {/* Друга картинка */}
          <ImageGridItem
            image={{
              src: '/images/home/stay-in-touch-berry-birds.webp',
              alt: 'stay-in-touch-berry-birds',
            }}
            aspect="aspect-343/331 md:h-full"
            items={3}
            className="md:hidden xl:block"
          />
        </Box>
      </Container>
    </Section>
  );
}
