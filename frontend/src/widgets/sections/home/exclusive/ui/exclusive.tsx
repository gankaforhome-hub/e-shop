import { FC } from 'react';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';
import { MediaSlide } from '@/widgets/media-slide';

interface IExclusiveProps {
  className?: string;
}

export const Exclusive: FC<IExclusiveProps> = ({ className }) => {
  return (
    <>
      <Section className={cn('', className)}>
        <Container className="relative">
          <Box className="max-sm:h-100 relative">
            <MediaSlide
              type="image"
              src={'/images/pages/home/exclusive.png'}
              alt={'exclusive'}
              poster={''}
              className="left-0 top-0 max-sm:absolute"
              width={810}
              height={450}
              sizes={'(max-width: 768px) 375px, 810px'}
            />
          </Box>
          <Box className="py-15 flex flex-col items-center justify-center">
            <Icon name="favorite" className="fill-fg-accent mb-9 size-6" />
            <Heading
              headingLevel="h2"
              className="max-w-1/2 mb-3 text-center uppercase max-sm:w-full"
            >
              Introducing create yooooour plate
            </Heading>
            <Text className="max-w-3/5 mb-9 text-center max-sm:w-full">
              Ganka exclusive provide the opportunity to create your customized
              plate. This tradition reaches back.
            </Text>
            <Button asChild variant="secondary">
              <AppLink href={routes.exclusive}>Discover more</AppLink>
            </Button>
          </Box>
        </Container>
      </Section>
    </>
  );
};
