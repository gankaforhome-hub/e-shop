// export default function CollectionsPage() {
//   return (
//     <>
//       {/* <Suspense fallback={<CollectionsSectionSkeleton />}> */}
//       {/* <CollectionsSection /> */}
//       {/* </Suspense> */}
//     </>
//   );
// }

import { CollectionsSection } from '@/widgets/sections/collections';

export default async function CollectionsPage() {
  // Отримуємо список усіх колекцій з бази даних чи API
  // const collections: Collection[] = await getCollections();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        Усі колекції
      </h1>
      <CollectionsSection />
    </>
  );
}
