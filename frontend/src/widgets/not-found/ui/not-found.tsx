import { FC } from 'react';

import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';
import Image from 'next/image';

interface INotFoundWidgetProps {
  className?: string;
}

const t = {
  ImageAlt: 'snail with error number 404',
  TextError: 'Error 404',
  PageHeader: 'Page not found',
  Description: "The page you were looking for doesn't exist or has been moved.",
  ButtonText: 'Back home',
  ButtonAriaLabel: ' Go back to the home page',
};

export const NotFoundWidget: FC<INotFoundWidgetProps> = () => {
  return (
    <Section className="fpy-6/30">
      <Container className="max-xl:fgap-8/16 flex flex-col items-center justify-center lg:flex-row-reverse lg:justify-between">
        <Image
          src="/images/not-found.webp"
          alt={t.ImageAlt}
          width={820}
          height={620}
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="h-auto w-full max-w-5xl"
        />
        <Box className="text-header max-w-lg">
          <Text className="ftext-3/4 fleading-8/9 fmb-2/4 uppercase tracking-wider">
            {t.TextError}
          </Text>
          <Heading
            headingLevel="h1"
            className="ftext-6/8 fleading-8/9 fmb-2/4 tracking-tight"
          >
            {t.PageHeader}
          </Heading>
          <Text className="ftext-4/6 fleading-6/8 fmb-8/16">
            {t.Description}
          </Text>
          <Button asChild>
            <AppLink href="/" aria-label={t.ButtonAriaLabel}>
              {t.ButtonText}
            </AppLink>
          </Button>
        </Box>
      </Container>
    </Section>
  );
};
