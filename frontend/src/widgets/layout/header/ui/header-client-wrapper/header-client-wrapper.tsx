'use client';

import { type ReactNode } from 'react';

import { useHeaderRef } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';

interface IHeaderClientWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export function HeaderClientWrapper({
  children,
  id,
  className,
}: IHeaderClientWrapperProps) {
  const headerRef = useHeaderRef();

  return (
    <header
      ref={headerRef}
      id={id}
      data-scrolled="false"
      data-show-submenu="true"
      className={cn(
        'group/header pointer-events-auto fixed left-0 right-0 top-0 z-50 transition-all duration-150 ease-out',
        'before:h-(--h-header-mob) md:before:h-(--h-header-tab) before:bg-background before:absolute before:bottom-full before:left-0 before:right-0',
        'data-[show-submenu=false]:bg-background/80 data-[show-submenu=true]:bg-background data-[show-submenu=false]:backdrop-blur-md',
        'data-[scrolled=true]:data-[show-submenu=true]:shadow-foreground/5 data-[scrolled=true]:data-[show-submenu=true]:shadow-lg',
        'data-[scrolled=true]:data-[show-submenu=false]:shadow-foreground/5 data-[scrolled=true]:data-[show-submenu=false]:shadow-md',
        'data-[scrolled=false]:shadow-none',
        className,
      )}
    >
      <div>{children}</div>
    </header>
  );
}
