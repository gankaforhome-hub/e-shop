import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getTeam } from '@/entities/team-member/server';
import { canAccess } from '@/entities/user';
import { getCurrentUser } from '@/entities/user/server';
import { TeamTable } from '@/features/manage-team';
import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { EmptyState } from '@/shared/ui/empty-state';
import { Heading } from '@/shared/ui/heading';
import { PageHeader } from '@/shared/ui/page-header';
import { Text } from '@/shared/ui/text';
import { SectionOverview } from '@/widgets/section-overview';

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('system.settings');
}

/** Admins manage the team here; the other settings are not built yet. */
export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!canAccess(user.role, [])) {
    return <SectionOverview section="system.settings" />;
  }

  const [t, result] = await Promise.all([getTranslations(), getTeam()]);
  if (!result.ok && result.status !== 401 && result.status !== 403) {
    throw new Error(`GET /admin/team failed with ${result.status}`);
  }

  return (
    <div className="flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <PageHeader
        eyebrow={t('nav.groups.system.label')}
        title={t('sections.system.settings.title')}
        description={t('sections.system.settings.description')}
      />
      <section aria-labelledby="team-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Heading id="team-heading" headingLevel="h2" variant="card">
            {t('team.title')}
          </Heading>
          <Text size="sm" variant="muted">
            {t('team.description')}
          </Text>
        </div>
        {result.ok ? (
          <TeamTable members={result.data} canAssignAdmin={user.isRoot} />
        ) : (
          <EmptyState
            icon="team"
            title={t('team.forbidden.title')}
            description={t('team.forbidden.description')}
          />
        )}
      </section>
    </div>
  );
}
