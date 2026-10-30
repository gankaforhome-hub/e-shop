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
    <div className="flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
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
