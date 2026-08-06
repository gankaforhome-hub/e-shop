import { type ReactNode } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { getMessages, setRequestLocale } from 'next-intl/server';

import { inter, lora } from '@/shared/config';
import { isValidLocale, locales } from '@/shared/i18n/routing';
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

interface ILocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: ILocaleLayoutProps) {
  const { lang } = await params;

  // Перевірка валідності параметру lang
  if (!isValidLocale(lang)) {
    notFound();
  }

  // Обов'язково для SSG / PPR у next-intl
  setRequestLocale(lang);

  // const dir = getLocaleDirection(lang);
  const messages = await getMessages();

  // const { common, layout } = await getDictionary(lang, ['common', 'layout']);
  // const languageOptions = getLanguageOptions(common.languages.options);

  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${lora.variable} m-0 grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] antialiased lg:grid-rows-[auto_1fr_auto]`}
      >
        <NextIntlClientProvider messages={messages}>
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
