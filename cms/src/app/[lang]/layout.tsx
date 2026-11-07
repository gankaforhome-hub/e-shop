import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { getTranslations } from 'next-intl/server';

import { noto } from '@/shared/config/fonts';
import { isValidLocale } from '@/shared/i18n/is-valid-locale';
import { locales } from '@/shared/i18n/routing';
import '@/shared/styles/global.css';
import { PreferencesScript } from '@/shared/ui/preferences-script';
import { TooltipProvider } from '@/shared/ui/tooltip';

export function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');

  return {
    // Page titles are composed by getPageTitle ("Page | Ganka CMS")
    title: t('title'),
    description: t('description'),
    // Private admin panel (see also the X-Robots-Tag header in next.config.ts)
    robots: { index: false, follow: false },
  };
}

export default async function CmsLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang} className={noto.variable} suppressHydrationWarning>
      <body>
        <PreferencesScript />
        <NextIntlClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
