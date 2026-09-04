import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import {
  CollectionsSection,
  CollectionsSectionSkeleton,
} from '@/widgets/sections/collections';

interface ICollectionsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function CollectionsPage({
  params,
}: ICollectionsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs />
      <Suspense fallback={<CollectionsSectionSkeleton />}>
        <CollectionsSection lang={lang} />
      </Suspense>
    </>
  );
}
