import { type ReactNode } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { setRequestLocale } from 'next-intl/server';

import { inter, lora } from '@/shared/config';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { getLocaleDirection, isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { locales } from '@/shared/i18n/routing';
import '@/shared/styles/global.css';
import { Footer } from '@/widgets/layout/footer';
import { Header } from '@/widgets/layout/header';

// export const viewport: Viewport = {

//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
//   // Also supported but less commonly used
//   // interactiveWidget: 'resizes-visual',
//   colorScheme: 'dark',
// };

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const meta = await getMetadata('layout', lang);

  return buildMetadata({ meta, lang, path: '/', isLayout: true });
}

export function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

interface ILocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: ILocaleLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }
  setRequestLocale(lang);
  const dir = getLocaleDirection(lang);

  return (
    <html lang={lang} dir={dir}>
      <body
        className={`${inter.variable} ${lora.variable} m-0 grid min-h-screen w-full grid-cols-1 grid-rows-[auto_1fr] antialiased lg:grid-rows-[auto_1fr_auto]`}
      >
        <NextIntlClientProvider>
          <Header lang={lang} />
          <main>{children}</main>
          <Footer lang={lang} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
