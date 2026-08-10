import { notFound } from 'next/navigation';

import { categories } from '@/entities/category/mock/categories';
import { getCollections } from '@/entities/collection/mock/collections';
import { mapProductToCard } from '@/entities/product/api/product-mapper';
import { productStore } from '@/entities/product/mock/products';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';
import { ProductGrid } from '@/widgets/sections/products';

export async function getCollectionDataBySlug(slug: string) {
  const allCollection = await getCollections();
  const collection = allCollection.find(col => col.slug === slug);

  if (!collection) {
    return null;
  }

  const categoryIdsSet = new Set(collection?.categoryIds ?? []);

  // 2. Фільтруємо категорії з обов'язковою перевіркою на наявність cat.id
  const collectionCategories = categories.filter(
    cat => cat?.id && categoryIdsSet.has(cat.id),
  );

  const collectionProducts = productStore
    .filter(prod => collection.productIds?.includes(prod.id))
    .map(mapProductToCard);

  return {
    collection,
    categories: collectionCategories,
    products: collectionProducts,
  };
}

interface PageProps {
  params: Promise<{
    lang: string;
    collectionSlug: string;
  }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { collectionSlug } = await params;
  const data = await getCollectionDataBySlug(collectionSlug);

  if (!data) {
    notFound();
  }

  const { collection, products } = data;

  return (
    <>
      <Section spacing="compact">
        <Container>
          <SectionIntro
            className="tracking-wider"
            headingId={collection.title}
            headingLevel="h1"
            heading={collection.title}
            description={collection.shortDescription}
            descriptionClassName="text-center"
          />
          <ImageTextPanel
            className="fmt-4/14"
            image={collection.media}
            paragraphs={collection.description}
            imagePosition="left"
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading headingLevel="h2" visibility={'hidden'}>
            Products from collection {collection.title}
          </Heading>

          <ProductGrid products={products} limit={12} />
        </Container>
      </Section>
    </>
  );
}
