import {
  CollectionsSection,
  CollectionsSectionSkeleton,
} from 'src/widgets/sections/collections';

import { Suspense } from 'react';

export default function CollectionsPage() {
  return (
    <>
      <Suspense fallback={<CollectionsSectionSkeleton />}>
        <CollectionsSection />
      </Suspense>
    </>
  );
}
