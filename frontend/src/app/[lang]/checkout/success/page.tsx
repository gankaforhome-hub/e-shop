import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import {
  isOrderId,
  OrderSuccess,
  OrderSuccessSkeleton,
} from '@/features/checkout';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { Container } from '@/shared/ui/container';

interface CheckoutSuccessPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CheckoutSuccessPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { common } = await getDictionary(['common'], lang);

  return {
    ...buildMetadata({
      meta: {
        title: common.checkout.success.pageTitle,
        description: common.checkout.success.message,
      },
      lang,
      path: routes.checkoutSuccess(),
    }),
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <Container className="py-10 md:py-16 xl:py-24">
      <Suspense fallback={<OrderSuccessSkeleton />}>
        <OrderSuccessBody searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function OrderSuccessBody({
  searchParams,
}: Pick<CheckoutSuccessPageProps, 'searchParams'>) {
  const { orderId } = await searchParams;

  return <OrderSuccess orderId={isOrderId(orderId) ? orderId : undefined} />;
}
