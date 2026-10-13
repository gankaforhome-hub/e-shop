import { type INavItemConfig, NavItem } from '@/features/navigation';
import { routes, type InfoSlug } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';

import { InfoNavDropdown } from './info-nav-dropdown';

interface ResponsiveNavProps {
  items: INavItemConfig[];
  currentSlug: InfoSlug;
  labels: {
    nav: string;
    currentPage: string;
  };
}

/**
 * Info pages nav. Mobile: native `<details>` dropdown showing the active page;
 * `lg+`: vertical sidebar. Links are `NavItem`s (active state + `aria-current`
 * from the pathname); `InfoNavDropdown` only adds close-on-select / Escape.
 */
export function ResponsiveNav({
  items,
  currentSlug,
  labels,
}: ResponsiveNavProps) {
  const currentHref = routes.info(currentSlug);
  const activeItem = items.find(item => item.href === currentHref);

  return (
    <>
      {/* `key` also resets the open state on back/forward navigation */}
      <InfoNavDropdown
        key={currentSlug}
        className={cn(
          'border-border bg-background group/info-nav rounded-lg border lg:hidden',
          '[interpolate-size:allow-keywords]',
          'details-content:h-0 details-content:overflow-hidden open:details-content:h-auto',
          'details-content:transition-[height,content-visibility] details-content:duration-(--dur-slow) details-content:ease-subtle details-content:[transition-behavior:allow-discrete]',
        )}
      >
        <summary
          className={cn(
            'font-caption text-foreground flex min-h-12 cursor-pointer touch-manipulation select-none list-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm uppercase tracking-widest outline-none [-webkit-tap-highlight-color:transparent] [&::-webkit-details-marker]:hidden',
            'active:bg-muted/30 duration-(--dur-normal) transition-colors',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-muted-foreground text-[0.6875rem] normal-case tracking-normal">
              {labels.currentPage}
            </span>
            <span className="truncate font-medium">{activeItem?.label}</span>
          </span>
          <Icon
            name="chevron-down"
            aria-hidden
            className="duration-(--dur-normal) ease-subtle size-4 shrink-0 transition-transform group-open/info-nav:rotate-180"
          />
        </summary>

        <nav aria-label={labels.nav} className="border-border border-t">
          <ul className="duration-(--dur-slow) flex flex-col py-1 opacity-0 transition-opacity group-open/info-nav:opacity-100">
            {items.map(item => (
              <li key={item.id}>
                <NavItem
                  variant="dropdown"
                  href={item.href}
                  label={item.label}
                />
              </li>
            ))}
          </ul>
        </nav>
      </InfoNavDropdown>

      <nav
        aria-label={labels.nav}
        className="max-lg:hidden lg:flex lg:flex-col lg:gap-4"
      >
        {items.map(item => (
          <NavItem
            key={item.id}
            variant="sidebar"
            href={item.href}
            label={item.label}
          />
        ))}
      </nav>
    </>
  );
}
