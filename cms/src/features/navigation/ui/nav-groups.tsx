import { Fragment } from 'react';

import { getTranslations } from 'next-intl/server';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/shared/ui/sidebar';

import { NavMenuLink, type NavMenuLinkProps } from './nav-menu-link';
import { type NavBlock, type NavItem } from '../model/nav-config';

type NavVariant = NavMenuLinkProps['variant'];

/** Links of one block as a menu list (also used alone, e.g. the sidebar footer). */
export async function NavMenu({
  items,
  variant,
}: {
  items: readonly NavItem[];
  variant: NavVariant;
}) {
  const t = await getTranslations('sections');

  return (
    <SidebarMenu>
      {items.map(item => (
        <SidebarMenuItem key={item.section}>
          <NavMenuLink
            href={item.href}
            icon={item.icon}
            label={t(`${item.section}.title`)}
            variant={variant}
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

/**
 * README blocks as labelled groups split by dividers. On the collapsed icon
 * rail the labels fold away and the dividers keep the blocks apart.
 */
export async function NavGroups({
  groups,
  variant,
}: {
  groups: readonly NavBlock[];
  variant: NavVariant;
}) {
  const t = await getTranslations('nav.groups');

  return groups.map((group, index) => {
    const labelId = `nav-${variant}-${group.id}`;

    return (
      <Fragment key={group.id}>
        {index > 0 && <SidebarSeparator />}
        <SidebarGroup role="group" aria-labelledby={labelId}>
          <SidebarGroupLabel id={labelId}>
            {t(`${group.id}.label`)}
          </SidebarGroupLabel>
          <NavMenu items={group.items} variant={variant} />
        </SidebarGroup>
      </Fragment>
    );
  });
}
