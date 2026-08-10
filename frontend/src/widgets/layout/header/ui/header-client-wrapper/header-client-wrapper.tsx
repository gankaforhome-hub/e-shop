'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { useScroll } from '@/shared/lib/hooks/useScroll';
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
  const { isScrolled, showSubMenu, setIsHovered } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeShowSubMenu = mounted ? showSubMenu : true;
  const activeIsScrolled = mounted ? isScrolled : false;

  return (
    <header
      id={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'pointer-events-auto fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out',
        'before:absolute before:bottom-full before:left-0 before:right-0 before:h-20 before:bg-white',
        !activeShowSubMenu ? 'bg-white/80 backdrop-blur-md' : 'bg-white',
        activeIsScrolled
          ? activeShowSubMenu
            ? 'shadow-lg shadow-black/5'
            : 'shadow-md shadow-black/5'
          : 'shadow-none',
        className,
      )}
    >
      <div data-show-submenu={activeShowSubMenu} className="group/header">
        {children}
      </div>
    </header>
  );
}
