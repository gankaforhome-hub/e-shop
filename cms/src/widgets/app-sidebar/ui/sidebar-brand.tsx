'use client';

import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Logo } from '@/shared/ui/logo';
import { SidebarMenuButton } from '@/shared/ui/sidebar';
import { Text } from '@/shared/ui/text';

/**
 * Client component on purpose: `asChild` (Radix Slot) must receive a
 * client-rendered link. A server-rendered `AppLink` arrives as a lazy RSC
 * chunk on re-renders (`router.refresh()`, Server Actions) and Slot throws.
 */
export function SidebarBrand({
  name,
  product,
}: {
  name: string;
  product: string;
}) {
  return (
    <SidebarMenuButton asChild size="brand" tooltip={name}>
      <AppLink href={routes.home}>
        <Logo />
        <div className="grid min-w-0 flex-1 leading-tight">
          <Text
            as="span"
            size="sm"
            weight="semibold"
            variant="emphasis"
            className="truncate"
          >
            {name}
          </Text>
          <Text as="span" size="xs" variant="muted" className="truncate">
            {product}
          </Text>
        </div>
      </AppLink>
    </SidebarMenuButton>
  );
}
