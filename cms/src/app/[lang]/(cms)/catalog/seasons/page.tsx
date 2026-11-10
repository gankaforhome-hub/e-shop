import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getAdminSeasons } from '@/entities/collection/server';
import { SeasonsTable } from '@/features/season-editor';
import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('catalog.seasons');
}

export default async function SeasonsPage() {
  const [t, result] = await Promise.all([getTranslations(), getAdminSeasons()]);

  if (!result.ok && result.status !== 401 && result.status !== 403) {
    throw new Error(`GET /admin/seasons failed with ${result.status}`);
  }

  return (
    <div className="flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <PageHeader
        eyebrow={t('nav.groups.catalog.label')}
        title={t('sections.catalog.seasons.title')}
        description={t('sections.catalog.seasons.description')}
      />
      {result.ok ? (
        <SeasonsTable seasons={result.data} />
      ) : (
        <EmptyState
          icon="seasons"
          title={t('seasons.forbidden.title')}
          description={t('seasons.forbidden.description')}
        />
      )}
    </div>
  );
}
