import { type INavItemConfig, NavItem } from '@/features/navigation';

interface MobileMenuBlockProps {
  items: INavItemConfig[];
  setActiveSubmenu: (item: INavItemConfig) => void;
  onClick: () => void;
}

export function MobileMenuBlock({
  items,
  setActiveSubmenu,
  onClick,
}: MobileMenuBlockProps) {
  return (
    <ul className="flex flex-col">
      {items.map(item => {
        const hasChildren = Boolean(item.children && item.children.length > 0);

        return (
          <li
            key={item.id}
            className="border-muted last:border-brand/60 border-b last:mb-4 last:border-b last:pb-4"
          >
            <NavItem
              variant="mobile"
              href={hasChildren ? undefined : item.href}
              label={item.labelKey}
              hasSubmenu={hasChildren}
              showActive={true}
              onClick={() => {
                if (hasChildren) {
                  setActiveSubmenu(item);
                } else {
                  onClick();
                }
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
