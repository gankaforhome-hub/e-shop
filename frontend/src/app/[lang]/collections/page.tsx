import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import {
  type CollectionsSearchParams,
  CollectionsSection,
  CollectionsSectionSkeleton,
} from '@/widgets/sections/collections';

interface ICollectionsPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<CollectionsSearchParams>;
}

export default async function CollectionsPage({
  params,
  searchParams,
}: ICollectionsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs />
      <Suspense fallback={<CollectionsSectionSkeleton />}>
        <CollectionsSection lang={lang} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
