import { type Metadata } from 'next';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { NotFoundWidget } from '@/widgets/not-found';

// export const metadata: Metadata = {
//   title: '404 - Сторінку не знайдено | Ganka for Home',
//   description: 'На жаль, запитувану сторінку не знайдено.',
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

export async function generateMetadata(): Promise<Metadata> {
  const { common } = await getDictionary(['common']);
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

export default async function LocalizeNotFound() {
  return <NotFoundWidget />;
}
