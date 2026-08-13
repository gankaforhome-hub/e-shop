'use client';

import { type INavItemConfig, NavItem } from '@/features/navigation';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';

const GRID_COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

function getGridColsClass(count: number): string {
  const cols = Math.ceil(count / 3);
  return GRID_COLS_MAP[cols] ?? 'grid-cols-4';
}

interface HeaderNavHoverItemProps {
  item: INavItemConfig;
}

export function HeaderNavHoverItem({ item }: HeaderNavHoverItemProps) {
  const children = item.children ?? [];
  const gridColsClass = getGridColsClass(children.length);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger asChild>
        <NavItem
          variant="header"
          hasSubmenu
          showActive={false}
          label={item.label}
          btnSubmenuChildren={
            <Icon
              name="chevron-down"
              className={cn(
                'text-icon ml-2 size-4 origin-center',
                'transform-gpu will-change-transform',
                'transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]',
                '[group:hover]:rotate-180 group-data-[state=open]:rotate-180',
              )}
            />
          }
        />
      </NavigationMenuTrigger>

      <NavigationMenuContent
        className={cn(
          'mt-2 w-max max-w-4xl px-8 py-6',
          'bg-background shadow-lg backdrop-blur-md',
        )}
      >
        <ul className={cn('grid gap-x-12 gap-y-3.5', gridColsClass)}>
          {children.map(child => (
            <li key={child.id} className="whitespace-nowrap">
              <NavItem
                variant="popover"
                href={child.href}
                label={child.label}
              />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
