import { type ReactNode } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { setRequestLocale } from 'next-intl/server';

import { inter, lora } from '@/shared/config';
import { getLocaleDirection, isValidLocale } from '@/shared/i18n/helpers';
import { locales } from '@/shared/i18n/routing';
import '@/shared/styles/global.css';
import { Footer } from '@/widgets/layout/footer';

// export const viewport: Viewport = {

//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
//   // Also supported but less commonly used
//   // interactiveWidget: 'resizes-visual',
//   colorScheme: 'dark',
// };

export const metadata: Metadata = {
  title: 'Ganka for Home',
  description: 'E-shop Ganka for Home',
};

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
        className={`${inter.variable} ${lora.variable} m-0 grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] antialiased lg:grid-rows-[auto_1fr_auto]`}
      >
        <NextIntlClientProvider>
          {/* <Header
            dict={common.navigation}
            collections={collections}
            languages={languageOptions}
          /> */}
          <main>{children}</main>
          <Footer />
          {/* <div id="modal-root" /> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
