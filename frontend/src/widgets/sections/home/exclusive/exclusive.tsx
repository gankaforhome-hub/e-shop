import { cn } from '@/shared/lib/utils';
import { AppMedia } from '@/shared/ui/app-media';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
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
          <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            <Box className="aspect-343/300 relative overflow-hidden">
              <AppMedia
                src={'/images/home/exclusive-plate-with-fruits-on-table.png'}
                alt={'exclusive-plate-with-fruits-on-table'}
                className="rounded-card"
                fill
                sizes={'(min-width: 768px) 45vw, 95vw'}
              />
            </Box>
            <Box className="aspect-343/300 relative overflow-hidden">
              <AppMedia
                src={'/images/home/exclusive-plate-with-rabbits.png'}
                alt={'exclusive-plate-with-rabbits'}
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
