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
        'hidden transition-all duration-300 ease-in-out lg:grid',
        'group-data-[show-submenu=true]/header:grid-rows-[1fr] group-data-[show-submenu=true]/header:pb-3 group-data-[show-submenu=true]/header:pt-1 group-data-[show-submenu=true]/header:opacity-100',
        'group-data-[show-submenu=false]/header:pointer-events-none group-data-[show-submenu=false]/header:grid-rows-[0fr] group-data-[show-submenu=false]/header:py-0 group-data-[show-submenu=false]/header:opacity-0',
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
