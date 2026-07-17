'use client';
import { usePathname } from 'next/navigation';
import { type FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { type NavItem } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface INavigationMenuProps {
  className?: string;
  navMenu: NavItem[];
  closeMenu?: () => void;
}

export const NavigationMenu: FC<INavigationMenuProps> = ({
  className,
  navMenu,
  closeMenu,
}) => {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <ul
        className={cn(
          'md:fgap-8/12.5 md:flex-row md:items-center md:justify-center',
          className,
        )}
      >
        {navMenu.map(({ title, href, ariaLabel, id }) => (
          <li
            key={id}
            className={cn(
              'border-border-muted border-b py-4 last:border-0 last:pb-0',
              'hover:border-border-accent custom-transition group flex items-center justify-between transition-colors',
            )}
          >
            <AppLink
              href={href}
              aria-label={ariaLabel}
              onClick={() => closeMenu?.()}
              className={cn('w-full items-center justify-between text-base', {
                'max-lg:text-fg-accent max-lg:border-border-accent':
                  pathname === href,
              })}
            >
              <span>{title}</span>
              <Icon
                name="arrow"
                className={cn('size-4 rotate-180 lg:hidden')}
              />
            </AppLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
