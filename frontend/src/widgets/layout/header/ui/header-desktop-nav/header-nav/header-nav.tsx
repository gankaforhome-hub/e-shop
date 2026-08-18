import { type INavItemConfig, NavItem } from '@/features/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/shared/ui/navigation-menu';

import { HeaderNavSubMenu } from '../header-nav-sub-menu';

interface HeaderNavProps {
  items: INavItemConfig[];
}

export function HeaderNav({ items }: HeaderNavProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-8 xl:gap-14">
        {items.map(item => {
          const hasChildren = (item.children?.length ?? 0) > 0;

          if (!hasChildren) {
            return (
              <NavigationMenuItem key={item.id}>
                <NavItem variant="header" href={item.href} label={item.label} />
              </NavigationMenuItem>
            );
          }

          return <HeaderNavSubMenu key={item.id} item={item} />;
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
