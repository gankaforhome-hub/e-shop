import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { ProductGridSkeleton } from '@/widgets/sections/products';
import { WishlistGrid } from '@/widgets/wishlist';

interface WishlistPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: WishlistPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { common } = await getDictionary(['common'], lang);

  return {
    ...buildMetadata({
      meta: {
        title: common.favorites.title,
        description: common.favorites.metaDescription,
      },
      lang,
      path: routes.wishlist,
    }),
    // Per-visitor list: never indexed
    robots: { index: false, follow: true },
  };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { common } = await getDictionary(['common'], lang);

  return (
    <>
      <Breadcrumbs lastItemTitle={common.favorites.title} />
      <Section>
        <Container className="flex flex-col gap-6 md:gap-8">
          <Heading
            headingLevel="h1"
            variant="document"
            tone="emphasis"
            visibility="hidden"
          >
            {common.favorites.title}
          </Heading>
          {/* The list comes from the favorites cookie (request time) */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <WishlistGrid lang={lang} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
