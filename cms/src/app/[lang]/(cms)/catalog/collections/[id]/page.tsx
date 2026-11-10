import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getLocale, getTranslations } from 'next-intl/server';

import { getCollectionTitle } from '@/entities/collection';
import { getAdminCollection, getSeasons } from '@/entities/collection/server';
import { routes } from '@/shared/config';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { AppLink } from '@/shared/ui/app-link';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { CollectionEditor } from '@/widgets/collection-editor';

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

// Reads the session and fresh API data: blocks like the shell instead of streaming
export const instant = false;

export async function generateMetadata({
  params,
}: EditCollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const [result, t] = await Promise.all([
    getAdminCollection(id),
    getTranslations('collections'),
  ]);

  return {
    title: await getPageTitle(
      result.ok
        ? t('editPageTitle', { title: getCollectionTitle(result.data) })
        : t('editTitle'),
    ),
  };
}

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { id } = await params;
  const [result, t, locale] = await Promise.all([
    getAdminCollection(id),
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
      href={routes.catalog.collections}
      className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground-emphasis"
    >
      <Icon name="arrow-left" />
      {t('collections.back')}
    </AppLink>
  );

  if (!result.ok) {
    if (result.status !== 401 && result.status !== 403) {
      throw new Error(
        `GET /admin/collections/:id failed with ${result.status}`,
      );
    }
    return (
      <div className={layout}>
        {backLink}
        <EmptyState
          icon="collections"
          title={t('collections.forbidden.title')}
          description={t('collections.forbidden.description')}
        />
      </div>
    );
  }

  const seasons = await getSeasons(locale);

  return (
    <div className={layout}>
      {backLink}
      <PageHeader
        eyebrow={t('collections.editEyebrow')}
        title={getCollectionTitle(result.data)}
        description={t('collections.editDescription', {
          slug: result.data.slug,
          sku: result.data.skuPrefix,
        })}
      />
      {/* Remounts with fresh defaults when another collection opens */}
      <CollectionEditor
        key={result.data.id}
        collection={result.data}
        seasons={seasons}
      />
    </div>
  );
}
