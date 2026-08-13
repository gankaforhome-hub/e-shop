import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IHeaderDesktopNavProps {
  children?: ReactNode;
  className?: string;
}

export function HeaderDesktopNav({
  children,
  className,
}: IHeaderDesktopNavProps) {
  return (
    <div
      className={cn(
        'hidden lg:grid',
        'transition-all duration-200 ease-out',
        'pointer-events-none grid-rows-[0fr] py-0 opacity-0',
        'group-data-[show-submenu=true]/header:pointer-events-auto group-data-[show-submenu=true]/header:grid-rows-[1fr] group-data-[show-submenu=true]/header:opacity-100',
        'group-hover/header:pointer-events-auto group-hover/header:grid-rows-[1fr] group-hover/header:opacity-100',
        'group-data-[show-submenu=true]/header:py-4',
        'group-hover/header:py-4',
        className,
      )}
    >
      <div
        className={cn(
          'min-h-0 transition-[overflow]',
          'overflow-hidden',
          'group-data-[show-submenu=true]/header:overflow-visible',
          'group-hover/header:overflow-visible',
        )}
      >
        {children}
      </div>
    </div>
  );
}
