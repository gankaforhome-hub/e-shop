'use client';

import { useTranslations } from 'next-intl';

import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

export function NotFoundWidget() {
  const t = useTranslations('common.notFound');
  return (
    <Section className="fpy-6/30">
      <Container className="max-xl:fgap-8/16 flex flex-col items-center justify-center lg:flex-row-reverse lg:justify-between">
        <AppMedia
          src={t('imageSrc')}
          alt={t('imageAlt')}
          width={820}
          height={620}
          placeholder="empty"
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="h-auto w-full max-w-7xl"
        />
        <div className="max-w-lg">
          <Text className="ftext-3/4 fleading-8/9 fmb-2/4 uppercase tracking-wider">
            {t('textError')}
          </Text>
          <Heading
            headingLevel="h1"
            className="ftext-6/8 fleading-8/9 fmb-2/4 tracking-tight"
          >
            {t('pageTitle')}
          </Heading>
          <Text as="h2" size="none" className="ftext-4/6 fleading-6/8 fmb-8/16">
            {t('description')}
          </Text>
          <Button asChild>
            <AppLink href="/" aria-label={t('buttonAriaLabel')}>
              {t('buttonText')}
            </AppLink>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
