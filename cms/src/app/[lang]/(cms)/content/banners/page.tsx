import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getAdminBanners } from '@/entities/banner/server';
import { canAccess } from '@/entities/user';
import { getCurrentUser } from '@/entities/user/server';
import { BannersList } from '@/features/reorder-banners';
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
  return getSectionMetadata('content.banners');
}

export default async function BannersPage() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);
  // Banners are for content and catalog staff (the API checks it again); admins pass every check
  const canEdit = canAccess(user.role, ['content-editor', 'catalog-manager']);
  const result = canEdit ? await getAdminBanners() : null;

  if (result && !result.ok && result.status !== 401 && result.status !== 403) {
    throw new Error(`GET /admin/banners failed with ${result.status}`);
  }

  return (
    <div className="flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <PageHeader
        eyebrow={t('nav.groups.content.label')}
        title={t('sections.content.banners.title')}
        description={t('banners.description')}
      />
      {result?.ok ? (
        <>
          <div className="flex justify-end">
            <Button asChild>
              <AppLink href={routes.content.newBanner}>
                <Icon name="add" />
                {t('banners.new')}
              </AppLink>
            </Button>
          </div>
          {result.data.length > 0 ? (
            <BannersList
              // A changed list on the server (another editor) remounts with fresh state
              key={result.data
                .map(item => `${item.id}:${item.updatedAt}`)
                .join()}
              banners={result.data}
            />
          ) : (
            <EmptyState
              icon="banners"
              title={t('banners.empty.title')}
              description={t('banners.empty.description')}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon="banners"
          title={t('banners.forbidden.title')}
          description={t('banners.forbidden.description')}
        />
      )}
    </div>
  );
}
