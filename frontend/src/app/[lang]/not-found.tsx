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

export default async function LocalizeNotFound() {
  return (
    <>
      <NotFoundWidget />;
    </>
  );
}

// export const metadata: Metadata = {
//   title: '404 - Сторінку не знайдено | Ganka for Home',
//   description: 'На жаль, запитувану сторінку не знайдено.',
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

// import { NextIntlClientProvider } from 'next-intl';

// import { getDictionary } from '@/shared/i18n/get-dictionary';
// import { getLocaleDirection } from '@/shared/i18n/helpers';
// import { getPreferredLocale } from '@/shared/i18n/helpers/get-preferred-locale';

// import { NotFoundWidget } from '../widgets/not-found';

// export default async function GlobalNotFound() {
//   const locale = await getPreferredLocale();
//   const { common } = await getDictionary(['common'], locale);
//   const dir = getLocaleDirection(locale);
//   return (
//     <html lang={locale} dir={dir}>
//       <body>
//         <NextIntlClientProvider locale={locale} messages={common}>
//           <NotFoundWidget />
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
