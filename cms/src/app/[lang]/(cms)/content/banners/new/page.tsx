import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getBannerLinkTargets } from '@/entities/banner/server';
import { canAccess } from '@/entities/user';
import { getCurrentUser } from '@/entities/user/server';
import { routes } from '@/shared/config';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { AppLink } from '@/shared/ui/app-link';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { BannerEditor } from '@/widgets/banner-editor';

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('banners');

  return { title: await getPageTitle(t('newTitle')) };
}

export default async function NewBannerPage() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);
  const canEdit = canAccess(user.role, ['content-editor', 'catalog-manager']);
  const linkTargets = canEdit ? await getBannerLinkTargets() : [];

  return (
    <div className="flex animate-in flex-col gap-6 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <AppLink
        href={routes.content.banners}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground-emphasis"
      >
        <Icon name="arrow-left" />
        {t('banners.back')}
      </AppLink>
      <PageHeader
        eyebrow={t('nav.groups.content.label')}
        title={t('banners.newTitle')}
        description={t('banners.newDescription')}
      />
      {canEdit ? (
        <BannerEditor linkTargets={linkTargets} />
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
