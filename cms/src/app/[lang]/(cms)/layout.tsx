import { type ReactNode } from 'react';

import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('nav');

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
