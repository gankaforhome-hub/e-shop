import { notFound } from 'next/navigation';

import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { FaqContentSection } from '@/widgets/sections/faq';

interface IFaqPageProps {
  params: Promise<{ lang: string }>;
}

export default async function FaqPage({ params }: IFaqPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }
  // const { faq } = await getDictionary(['faq'], lang);

  return (
    <>
      <Breadcrumbs />
      <FaqContentSection lang={lang} />
    </>
  );
}
