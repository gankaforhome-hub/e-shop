import { getTranslations } from 'next-intl/server';

import { findNavItem } from '@/features/navigation';
import { type SectionKey } from '@/shared/i18n/types';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

/** Landing of a CMS section whose tools are not built yet: title, purpose, empty state. */
export async function SectionOverview({ section }: { section: SectionKey }) {
  const t = await getTranslations();
  const navEntry = findNavItem(section);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        eyebrow={navEntry && t(`nav.groups.${navEntry.group}.label`)}
        title={t(`sections.${section}.title`)}
        description={t(`sections.${section}.description`)}
      />
      <EmptyState
        icon={navEntry?.item.icon ?? 'section'}
        title={t('emptyState.title')}
        description={t('emptyState.description')}
      />
    </div>
  );
}
