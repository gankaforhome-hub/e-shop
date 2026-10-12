import { notFound } from 'next/navigation';

import { isValidLocale } from '@/shared/i18n/helpers';
import { BlankPage } from '@/widgets/blank-page';

interface CartPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  return <BlankPage />;
}
