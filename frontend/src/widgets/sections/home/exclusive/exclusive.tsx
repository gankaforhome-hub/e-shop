import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';

interface IExclusiveSection {
  className?: string;
}

export function ExclusiveSection({ className }: IExclusiveSection) {
  return (
    <>
      <Section className={cn('', className)}>
        <Container>
          <Heading headingLevel="h2" className="fmb-6/16 text-center">
            Exclusive from Ganka
          </Heading>
          <Box className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6')}>
            <ImageGridItem
              image={{
                src: '/images/home/exclusive-plate-with-fruits-on-table.png',
                alt: 'exclusive-plate-with-fruits-on-table',
              }}
              aspect="aspect-343/300"
              items={2}
            />
            <ImageGridItem
              image={{
                src: '/images/home/exclusive-plate-with-rabbits.png',
                alt: 'exclusive-plate-with-rabbits',
              }}
              aspect="aspect-343/300"
              items={2}
            />
          </Box>
          <Button asChild variant={'outline'} className="fmt-8/16 mx-auto flex">
            <AppLink href={routes.exclusive}>See More</AppLink>
          </Button>
        </Container>
      </Section>
    </>
  );
}
