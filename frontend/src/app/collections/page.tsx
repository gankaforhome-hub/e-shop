import { CollectionsSection } from '@/widgets/sections/collections';

export default function CollectionsPage() {
  return (
    <>
      {/* <Suspense fallback={<CollectionsSectionSkeleton />}> */}
      <CollectionsSection />
      {/* </Suspense> */}
    </>
  );
}
