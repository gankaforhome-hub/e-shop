import Link from 'next/link';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';

export type NavLink = {
  id: string;
  title: string;
  href: string;
  ariaLabel: string;
};

interface INavigationMenuProps {
  className?: string;
  links: NavLink[];
}

export const NavigationMenu: FC<INavigationMenuProps> = ({
  className,
  links,
}) => {
  return (
    <nav>
      <ul
        className={cn(
          'md:fgap-8/12.5 md:flex md:items-center md:justify-center',
          className,
        )}
      >
        {links.map(({ title, href, ariaLabel, id }) => (
          <li key={id}>
            <Link href={href} aria-label={ariaLabel}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
