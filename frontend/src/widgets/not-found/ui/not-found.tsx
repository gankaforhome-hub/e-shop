import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface INotFoundWidgetProps {
  imageAlt?: string;
  textError?: string;
  pageTitle?: string;
  description?: string;
  buttonText?: string;
  buttonAriaLabel?: string;
}

export function NotFoundWidget({
  imageAlt = '',
  textError = '',
  pageTitle = '',
  description = '',
  buttonText = '',
  buttonAriaLabel = '',
}: INotFoundWidgetProps) {
  const t = useTranslations('common.notFound');
  return (
    <Section className="fpy-6/30">
      <Container className="max-xl:fgap-8/16 flex flex-col items-center justify-center lg:flex-row-reverse lg:justify-between">
        <Image
          src="/images/not-found.webp"
          alt={t('imageAlt')}
          width={820}
          height={620}
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="h-auto w-full max-w-7xl"
        />
        <Box className="text-header max-w-lg">
          <Text className="ftext-3/4 fleading-8/9 fmb-2/4 uppercase tracking-wider">
            {t('textError')}
          </Text>
          <Heading
            headingLevel="h1"
            className="ftext-6/8 fleading-8/9 fmb-2/4 tracking-tight"
          >
            {t('pageTitle')}
          </Heading>
          <h2 className="ftext-4/6 fleading-6/8 fmb-8/16">
            {t('description')}
          </h2>
          <Button asChild>
            <AppLink href="/" aria-label={t('buttonAriaLabel')}>
              {t('buttonText')}
            </AppLink>
          </Button>
        </Box>
      </Container>
    </Section>
  );
}
