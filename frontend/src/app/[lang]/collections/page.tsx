import { Suspense } from 'react';

import {
  CollectionsSection,
  CollectionsSectionSkeleton,
} from '@/widgets/sections/collections';

export default function CollectionsPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        Усі колекції
      </h1>
      <Suspense fallback={<CollectionsSectionSkeleton />}>
        <CollectionsSection />
      </Suspense>
    </>
  );
}
