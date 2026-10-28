import { getTranslations } from 'next-intl/server';

import { UserCard } from '@/entities/user';
import { getCurrentUser } from '@/entities/user/server';
import { AccountMenu } from '@/features/account-menu';
import { getNavBlocks, NavGroups, SYSTEM_NAV } from '@/features/navigation';
import { LanguageMenu, LanguageSegmented } from '@/features/select-language';
import { ThemeSegmented, ThemeToggle } from '@/features/select-theme';
import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Text } from '@/shared/ui/text';

import { MobileNav } from './mobile-nav';

/**
 * Desktop: sidebar toggle on the left; theme, language and account on the right.
 * Mobile: menu button + brand; everything else lives in the sheet.
 */
export async function AppHeader() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);

  const brand = (
    <AppLink
      href={routes.home}
      className="flex min-w-0 items-center gap-2.5 rounded-md"
    >
      <Logo className="size-7" />
      <Text
        as="span"
        size="sm"
        weight="semibold"
        variant="emphasis"
        className="truncate"
      >
        {t('brand.short')}
      </Text>
    </AppLink>
  );

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md md:px-4">
      <MobileNav
        labels={{
          open: t('nav.openMenu'),
          close: t('nav.closeMenu'),
          title: t('nav.menuTitle'),
          description: t('nav.menuDescription'),
        }}
        brand={brand}
        footer={
          <div className="flex flex-col gap-4">
            <UserCard user={user} caption={t(`account.roles.${user.role}`)} />
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2">
              <Text as="span" size="xs" variant="muted">
                {t('theme.label')}
              </Text>
              <ThemeSegmented />
              <Text as="span" size="xs" variant="muted">
                {t('language.label')}
              </Text>
              <LanguageSegmented />
            </div>
          </div>
        }
      >
        <nav aria-label={t('nav.label')}>
          <NavGroups
            groups={[...getNavBlocks(user.role), SYSTEM_NAV]}
            variant="sheet"
          />
        </nav>
      </MobileNav>

      <SidebarTrigger
        labels={{
          collapse: t('nav.collapseSidebar'),
          expand: t('nav.expandSidebar'),
        }}
        className="-ml-1 hidden md:inline-flex"
      />

      <div className="flex min-w-0 md:hidden">{brand}</div>

      <div className="ml-auto hidden items-center gap-1 md:flex">
        <ThemeToggle />
        <LanguageMenu />
        <Separator orientation="vertical" className="mx-1.5 h-5" />
        <AccountMenu user={user} />
      </div>
    </header>
  );
}
