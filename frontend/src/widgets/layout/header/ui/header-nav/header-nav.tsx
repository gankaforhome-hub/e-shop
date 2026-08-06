// widgets/header/ui/header-nav.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

import { NavItem, type INavItemConfig } from '@/features/navigation';
import { cn } from '@/shared/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

interface HeaderNavProps {
  items: INavItemConfig[];
}

export function HeaderNav({ items }: HeaderNavProps) {
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
                <NavItem
                  variant="header"
                  href={item.href}
                  label={item.labelKey}
                />
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

{
  /* Окремий sub-компонент для обробки hover-стану з затримкою */
}
function HeaderNavHoverItem({ item }: { item: INavItemConfig }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const childrenCount = item.children?.length ?? 0;

  const gridColsClass =
    childrenCount <= 3
      ? 'grid-cols-1'
      : childrenCount <= 6
        ? 'grid-cols-2'
        : childrenCount <= 9
          ? 'grid-cols-3'
          : 'grid-cols-4';

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
          <span className="group flex cursor-pointer items-center gap-1 py-1">
            <NavItem variant="header" href={item.href} label={item.labelKey} />
            <ChevronDown
              className={`text-icon duration-(--dur-normal) size-4 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </span>
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
                  label={child.labelKey}
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
