import { getTranslations } from 'next-intl/server';

import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

export async function NotFoundView() {
  const t = await getTranslations('notFound');

  return (
    <div className="flex min-h-[60svh] animate-in flex-col items-center justify-center gap-3 text-center duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <Text size="display" variant="brand" className="mb-2 opacity-25">
        404
      </Text>
      <Heading headingLevel="h1">{t('title')}</Heading>
      <Text size="sm" variant="muted" className="max-w-md">
        {t('description')}
      </Text>
      <Button asChild className="mt-3">
        <AppLink href={routes.home}>
          <Icon name="arrow-left" />
          {t('back')}
        </AppLink>
      </Button>
    </div>
  );
}
