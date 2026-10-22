import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { CheckoutWidget } from '@/widgets/checkout';

interface CheckoutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { common } = await getDictionary(['common'], lang);

  return {
    ...buildMetadata({
      meta: {
        title: common.checkout.pageTitle,
        description: common.checkout.metaDescription,
      },
      lang,
      path: routes.checkout,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { common } = await getDictionary(['common'], lang);

  return (
    <>
      <Breadcrumbs lastItemTitle={common.checkout.pageTitle} />
      <Container className="flex flex-col gap-8 pb-16 md:gap-10 md:pb-24">
        <Heading headingLevel="h1" variant="document" tone="emphasis">
          {common.checkout.pageTitle}
        </Heading>
        <CheckoutWidget />
      </Container>
    </>
  );
}
