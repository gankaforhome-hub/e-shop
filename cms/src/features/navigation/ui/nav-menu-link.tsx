'use client';

import { Suspense } from 'react';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { AppLink } from '@/shared/ui/app-link';
import { Icon, type IconName } from '@/shared/ui/icon';
import { SidebarMenuButton } from '@/shared/ui/sidebar';

import { isActiveRoute } from '../lib/is-active-route';

export interface NavMenuLinkProps {
  href: AppRoutes;
  icon: IconName;
  label: string;
  /** `sidebar`: compact rows with icon-rail tooltips; `sheet`: touch rows. */
  variant: 'sidebar' | 'sheet';
}

/**
 * The active state reads `usePathname()`, which suspends while prerendering
 * a route's fallback shell (Cache Components). Each link gets its own
 * boundary whose fallback is the same link, inactive: no layout shift.
 */
export function NavMenuLink(props: NavMenuLinkProps) {
  return (
    <Suspense fallback={<NavMenuLinkView {...props} isActive={false} />}>
      <ActiveNavMenuLink {...props} />
    </Suspense>
  );
}

function ActiveNavMenuLink(props: NavMenuLinkProps) {
  const pathname = usePathname();

  return (
    <NavMenuLinkView
      {...props}
      isActive={isActiveRoute(pathname, props.href)}
    />
  );
}

function NavMenuLinkView({
  href,
  icon,
  label,
  variant,
  isActive,
}: NavMenuLinkProps & { isActive: boolean }) {
  const isSidebar = variant === 'sidebar';

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      size={isSidebar ? 'default' : 'touch'}
      tooltip={isSidebar ? label : undefined}
    >
      <AppLink href={href} aria-current={isActive ? 'page' : undefined}>
        <Icon name={icon} />
        <span>{label}</span>
      </AppLink>
    </SidebarMenuButton>
  );
}
