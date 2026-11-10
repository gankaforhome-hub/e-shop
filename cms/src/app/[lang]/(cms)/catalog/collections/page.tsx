import { type Metadata } from 'next';

import { getLocale, getTranslations } from 'next-intl/server';

import { getAdminCollections, getSeasons } from '@/entities/collection/server';
import { CollectionsBoard } from '@/features/reorder-collections';
import { routes } from '@/shared/config';
import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('catalog.collections');
}

export default async function CollectionsPage() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);
  const [result, seasons] = await Promise.all([
    getAdminCollections(),
    getSeasons(locale),
  ]);

  const header = (
    <PageHeader
      eyebrow={t('nav.groups.catalog.label')}
      title={t('sections.catalog.collections.title')}
      description={t('sections.catalog.collections.description')}
    />
  );
  const layout =
    'flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none';

  if (!result.ok) {
    if (result.status !== 401 && result.status !== 403) {
      throw new Error(`GET /admin/collections failed with ${result.status}`);
    }
    return (
      <div className={layout}>
        {header}
        <EmptyState
          icon="collections"
          title={t('collections.forbidden.title')}
          description={t('collections.forbidden.description')}
        />
      </div>
    );
  }

  return (
    <div className={layout}>
      {header}
      <div className="flex justify-end">
        <Button asChild>
          <AppLink href={routes.catalog.newCollection}>
            <Icon name="add" />
            {t('collections.new')}
          </AppLink>
        </Button>
      </div>
      {result.data.length > 0 ? (
        <CollectionsBoard
          // A saved order comes back as new props: remount with a clean draft
          key={result.data.map(item => `${item.id}:${item.sortOrder}`).join()}
          collections={result.data}
          seasons={seasons}
        />
      ) : (
        <EmptyState
          icon="collections"
          title={t('collections.empty.title')}
          description={t('collections.empty.description')}
        />
      )}
    </div>
  );
}
