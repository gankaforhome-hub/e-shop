import { type INavItemConfig, NavItem } from '@/features/navigation';

import { HeaderNavHoverItem } from './header-nav-hover-item';

interface HeaderNavProps {
  items: INavItemConfig[];
}

export function HeaderNav({ items }: HeaderNavProps) {
  console.log('🚀 ~ HeaderNav ~ HeaderNav:');

  return (
    <nav aria-label="Головна навігація">
      <ul className="flex items-center justify-center gap-8 text-lg font-medium capitalize lg:gap-14">
        {items.map(item => {
          const hasChildren = Boolean(
            item.children && item.children.length > 0,
          );

          if (!hasChildren) {
            return (
              <li key={item.id}>
                <NavItem variant="header" href={item.href} label={item.label} />
              </li>
            );
          }

          return (
            <li key={item.id}>
              <HeaderNavHoverItem item={item} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
