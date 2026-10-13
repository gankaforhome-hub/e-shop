import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getCollectionBySlug, getCollections } from '@/entities/collection';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { locales } from '@/shared/i18n/routing';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';
import {
  ProductGridLoader,
  ProductGridSkeleton,
} from '@/widgets/sections/products';

interface PageProps {
  params: Promise<{
    lang: string;
    collectionSlug: string;
  }>;
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async lang =>
      (await getCollections(lang)).map(collection => ({
        lang,
        collectionSlug: collection.slug,
      })),
    ),
  );
  return perLocale.flat();
}

export default async function CollectionPage({ params }: PageProps) {
  const { lang, collectionSlug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const [dict, collection] = await Promise.all([
    getDictionary(['common', 'collections'], lang),
    getCollectionBySlug(collectionSlug, lang),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dict.common.navigation.main.collections,
            href: routes.collections,
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
            headingVisible
          />
          <ImageTextPanel
            className="fmt-4/14"
            image={collection.media}
            paragraphs={collection.description}
            imagePosition="left"
            priority
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading headingLevel="h2" visibility={'hidden'}>
            {`${dict.collections.collectionProducts.sectionTitle} ${collection.title}`}
          </Heading>

          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <ProductGridLoader
              query={{ lang, collectionId: collection.id }}
              limit={12}
            />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
