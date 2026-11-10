import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getLocale, getTranslations } from 'next-intl/server';

import { getBannerTitle } from '@/entities/banner';
import { getAdminBanner, getBannerLinkTargets } from '@/entities/banner/server';
import { routes } from '@/shared/config';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { AppLink } from '@/shared/ui/app-link';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { BannerEditor } from '@/widgets/banner-editor';

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export async function generateMetadata({
  params,
}: EditBannerPageProps): Promise<Metadata> {
  const { id } = await params;
  const [result, t, locale] = await Promise.all([
    getAdminBanner(id),
    getTranslations('banners'),
    getLocale(),
  ]);

  return {
    title: await getPageTitle(
      result.ok
        ? t('editPageTitle', { title: getBannerTitle(result.data, locale) })
        : t('editTitle'),
    ),
  };
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const [result, t, locale] = await Promise.all([
    getAdminBanner(id),
    getTranslations(),
    getLocale(),
  ]);

  // A malformed id answers 400, an unknown one 404: both are a missing page
  if (!result.ok && (result.status === 400 || result.status === 404)) {
    notFound();
  }

  const layout =
    'flex animate-in flex-col gap-6 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none';
  const backLink = (
    <AppLink
      href={routes.content.banners}
      className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground-emphasis"
    >
      <Icon name="arrow-left" />
      {t('banners.back')}
    </AppLink>
  );

  if (!result.ok) {
    if (result.status !== 401 && result.status !== 403) {
      throw new Error(`GET /admin/banners/:id failed with ${result.status}`);
    }
    return (
      <div className={layout}>
        {backLink}
        <EmptyState
          icon="banners"
          title={t('banners.forbidden.title')}
          description={t('banners.forbidden.description')}
        />
      </div>
    );
  }

  const linkTargets = await getBannerLinkTargets();

  return (
    <div className={layout}>
      {backLink}
      <PageHeader
        eyebrow={t('banners.editEyebrow')}
        title={getBannerTitle(result.data, locale)}
        description={t(`banners.status.${result.data.status}`)}
      />
      {/* Remounts with fresh defaults when another banner opens */}
      <BannerEditor
        key={result.data.id}
        banner={result.data}
        linkTargets={linkTargets}
      />
    </div>
  );
}
