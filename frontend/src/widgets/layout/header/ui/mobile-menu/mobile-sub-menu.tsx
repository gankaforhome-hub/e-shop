import { NavItem, type INavItemConfig } from '@/features/navigation';

interface MobileSubMenuProps {
  activeSubmenu: INavItemConfig | null;
  onClick: () => void;
}

export function MobileSubMenu({ activeSubmenu, onClick }: MobileSubMenuProps) {
  if (!activeSubmenu) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ul className="flex flex-col">
        {activeSubmenu.children?.map(child => (
          <li key={child.id} className="border-muted border-b">
            <NavItem
              variant="mobile"
              href={child.href}
              label={child.labelKey}
              onClick={onClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
