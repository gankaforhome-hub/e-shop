import { type Metadata } from 'next';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { NotFoundWidget } from '@/widgets/not-found';

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  const { common } = await getDictionary(['common'], lang);
  const { notFound } = common;
  return {
    title: `${notFound.pageTitle || '404 - Сторінку не знайдено'} | Ganka for Home`,
    description: notFound.description || 'Сторінку не знайдено',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalizeNotFound() {
  return (
    <>
      <NotFoundWidget />;
    </>
  );
}
