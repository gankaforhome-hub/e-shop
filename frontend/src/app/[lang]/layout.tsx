import { type ReactNode } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { noto, playfair } from '@/shared/config';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { getLocaleDirection, isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { locales } from '@/shared/i18n/routing';
import { ToasterProvider } from '@/shared/providers/toaster';
import '@/shared/styles/global.css';
import { Footer } from '@/widgets/layout/footer';
import { Header } from '@/widgets/layout/header';

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
  const dir = getLocaleDirection(lang);
  return (
    <html lang={lang} dir={dir}>
      <body
        className={`${noto.variable} ${playfair.variable} flex min-h-screen w-full flex-col antialiased`}
      >
        <NextIntlClientProvider>
          <ToasterProvider />
          <Header lang={lang} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
