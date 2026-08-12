'use client';
import { useRef, useState } from 'react';

import { type INavItemConfig, NavItem } from '@/features/navigation';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

const GRID_COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function getGridColsClass(count: number): string {
  if (count <= 3) {
    return GRID_COLS_MAP[1] ?? 'grid-cols-1';
  }
  if (count <= 6) {
    return GRID_COLS_MAP[2] ?? 'grid-cols-2';
  }
  if (count <= 9) {
    return GRID_COLS_MAP[3] ?? 'grid-cols-3';
  }
  return GRID_COLS_MAP[4] ?? 'grid-cols-4';
}

export function HeaderNavHoverItem({ item }: { item: INavItemConfig }) {
  console.log('🚀 ~ HeaderNavHoverItem ~ HeaderNavHoverItem:');
  const children = item.children ?? [];
  const gridColsClass = getGridColsClass(children.length);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <PopoverTrigger asChild>
          <NavItem
            variant="header"
            label={item.label}
            hasSubmenu
            showActive={false}
            className="group cursor-pointer py-1"
            btnSubmenuChildren={
              <Icon
                name="chevron-down"
                className={cn(
                  'text-icon duration-(--dur-normal) size-4 transition-transform',
                  open ? 'rotate-180' : '',
                )}
              />
            }
          />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={12}
          alignOffset={-12}
          className={cn(
            'bg-background/95 border-border/50 rounded-b-lg rounded-t-none border shadow-2xl backdrop-blur-md',
            'w-max max-w-4xl px-8 py-6',
            'animate-in fade-in-0 zoom-in-95 duration-200',
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul className={cn('grid gap-x-12 gap-y-3.5', gridColsClass)}>
            {item.children?.map(child => (
              <li key={child.id} className="whitespace-nowrap">
                <NavItem
                  variant="popover"
                  href={child.href}
                  label={child.label}
                  onClick={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </PopoverContent>
      </div>
    </Popover>
  );
}
