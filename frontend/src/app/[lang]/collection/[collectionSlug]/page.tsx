import { notFound } from 'next/navigation';

import { getCategories } from '@/entities/category';
import { getCollections } from '@/entities/collection';
import { getProducts } from '@/entities/product/api/get-products';
import { createRoute } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';
import { ProductGrid } from '@/widgets/sections/products';

export async function getCollectionDataBySlug(slug: string, lang: Locale) {
  const allCollection = await getCollections(lang);
  const collection = allCollection.find(col => col.slug === slug);

  if (!collection) {
    return null;
  }

  const categoryIdsSet = new Set(collection?.categoryIds ?? []);

  const collectionCategories = (await getCategories(lang)).filter(
    cat => cat?.id && categoryIdsSet.has(cat.id),
  );

  const collectionProducts = (await getProducts({ lang })).data;

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
  const { lang, collectionSlug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }
  const dict = await getDictionary(['common'], lang);

  const data = await getCollectionDataBySlug(collectionSlug, lang);

  if (!data) {
    notFound();
  }

  const { collection, products } = data;

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dict.common.navigation.main.collections,
            href: createRoute('/collections'),
          },
        ]}
      />
      <Section>
        <Container>
          <SectionIntro
            className="tracking-wider"
            headingId={collection.title}
            headingLevel="h1"
            heading={collection.title}
            description={collection.shortDescription}
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
