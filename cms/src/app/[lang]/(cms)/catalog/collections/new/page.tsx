import { type Metadata } from 'next';

import { getLocale, getTranslations } from 'next-intl/server';

import { getSeasons } from '@/entities/collection/server';
import { routes } from '@/shared/config';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { CollectionEditor } from '@/widgets/collection-editor';

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('collections');

  return { title: await getPageTitle(t('newTitle')) };
}

export default async function NewCollectionPage() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);
  const seasons = await getSeasons(locale);

  return (
    <div className="flex animate-in flex-col gap-6 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <AppLink
        href={routes.catalog.collections}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground-emphasis"
      >
        <Icon name="arrow-left" />
        {t('collections.back')}
      </AppLink>
      <PageHeader
        eyebrow={t('nav.groups.catalog.label')}
        title={t('collections.newTitle')}
        description={t('collections.newDescription')}
      />
      <CollectionEditor seasons={seasons} />
    </div>
  );
}
