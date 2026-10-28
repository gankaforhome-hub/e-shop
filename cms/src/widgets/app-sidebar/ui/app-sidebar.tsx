import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/entities/user/server';
import {
  getNavBlocks,
  NavGroups,
  NavMenu,
  SYSTEM_NAV,
} from '@/features/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/ui/sidebar';

import { SidebarBrand } from './sidebar-brand';

/** Desktop navigation: brand, the three README blocks, system links at the bottom. */
export async function AppSidebar() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarBrand name={t('brand.name')} product={t('brand.product')} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label={t('nav.label')}>
          <NavGroups groups={getNavBlocks(user.role)} variant="sidebar" />
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <nav aria-label={t('nav.groups.system.label')}>
          <NavMenu items={SYSTEM_NAV.items} variant="sidebar" />
        </nav>
      </SidebarFooter>

      <SidebarRail
        labels={{
          collapse: t('nav.collapseSidebar'),
          expand: t('nav.expandSidebar'),
        }}
      />
    </Sidebar>
  );
}
