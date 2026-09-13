import { notFound } from 'next/navigation';

import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { DeliveryConditionsSection } from '@/widgets/sections/delivery';

interface IFaqPageProps {
  params: Promise<{ lang: string }>;
}

export default async function DeliveryPage({ params }: IFaqPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }
  // const { faq } = await getDictionary(['faq'], lang);

  return (
    <>
      <Breadcrumbs />
      <DeliveryConditionsSection lang={lang} />
    </>
  );
}
