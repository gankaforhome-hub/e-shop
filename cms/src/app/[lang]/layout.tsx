import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import { getTranslations } from 'next-intl/server';

import { noto } from '@/shared/config/fonts';
import { isValidLocale } from '@/shared/i18n/is-valid-locale';
import { locales } from '@/shared/i18n/routing';
import '@/shared/styles/global.css';
import { PreferencesScript } from '@/shared/ui/preferences-script';
import { SidebarInset, SidebarLayout } from '@/shared/ui/sidebar';
import { SkipLink } from '@/shared/ui/skip-link';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { AppHeader } from '@/widgets/app-header';
import { AppSidebar } from '@/widgets/app-sidebar';

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

  const t = await getTranslations('nav');

  return (
    <html lang={lang} className={noto.variable} suppressHydrationWarning>
      <body>
        <PreferencesScript />
        <NextIntlClientProvider>
          <TooltipProvider>
            <SkipLink href="#main-content" label={t('skipToContent')} />
            <SidebarLayout>
              <AppSidebar />
              <SidebarInset>
                <AppHeader />
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="flex-1 px-4 py-6 outline-none md:px-8 md:py-8"
                >
                  <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>
              </SidebarInset>
            </SidebarLayout>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
