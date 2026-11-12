import { type ReactNode } from 'react';

import { getLocale, getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/entities/user/server';
import { routes } from '@/shared/config';
import { redirect } from '@/shared/i18n/navigation';
import { SidebarInset, SidebarLayout } from '@/shared/ui/sidebar';
import { SkipLink } from '@/shared/ui/skip-link';
import { AppHeader } from '@/widgets/app-header';
import { AppSidebar } from '@/widgets/app-sidebar';

// The shell depends on the session, so it blocks instead of flashing skeletons
export const instant = false;

export default async function CmsShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [t, { keyStep }] = await Promise.all([
    getTranslations('nav'),
    getCurrentUser(),
  ]);
  // No key, an unconfirmed session or no approval yet: the key step comes first
  if (keyStep) {
    return redirect({ href: routes.securityKey, locale: await getLocale() });
  }

  return (
    <>
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
    </>
  );
}
