// export default function CollectionsPage() {
//   return (
//     <>
//       {/* <Suspense fallback={<CollectionsSectionSkeleton />}> */}
//       {/* <CollectionsSection /> */}
//       {/* </Suspense> */}
//     </>
//   );
// }

import Image from 'next/image';

import { collections } from '@/entities/collection/mock/collections';
import { routes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';

interface Collection {
  id: string;
  title: string;
  slug: string;
  image?: string;
  productsCount?: number;
}

export default async function CollectionsPage() {
  // Отримуємо список усіх колекцій з бази даних чи API
  // const collections: Collection[] = await getCollections();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
        Усі колекції
      </h1>

      {/* Сітка з картками колекцій */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map(collection => (
          <AppLink
            key={collection.id}
            /* КЛЮЧОВИЙ МОМЕНТ: перехід на одну колекцію /collection/slug */
            href={routes.collection(collection.slug)}
            className="group relative flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-lg"
          >
            {/* Обкладинка колекції */}
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              {collection.media && (
                <Image
                  src={collection.media.src}
                  alt={collection.title}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>

            {/* Текстова частина */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <h2 className="text-text-primary group-hover:text-accent text-lg font-semibold">
                {collection.title
                  ? collection.title.charAt(0).toUpperCase() +
                    collection.title.slice(1).toLowerCase()
                  : ''}
              </h2>

              {/* {collection.productsCount !== undefined && (
                <span className="text-text-secondary mt-2 text-xs">
                  {collection.productsCount} товарів
                </span>
              )} */}
            </div>
          </AppLink>
        ))}
      </div>
    </main>
  );
}
