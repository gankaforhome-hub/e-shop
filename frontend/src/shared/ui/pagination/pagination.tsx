import { type AppRoutes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

export interface PaginationProps {
  /** Page URLs in order (`hrefs[0]` = page 1); built by the caller. */
  hrefs: readonly AppRoutes[];
  /** 1-based current (last shown) page. */
  current: number;
  /**
   * First page currently on screen when several are shown ("Load more").
   * Pages `rangeStart…current` are highlighted as loaded. Defaults to `current`.
   */
  rangeStart?: number;
  labels: {
    /** Accessible name of the `<nav>` ("Catalog pages"). */
    nav: string;
    previous: string;
    next: string;
    /** Accessible name of a page link ("Page 3"). */
    page: (page: number) => string;
  };
  /**
   * Passed to every link (Next.js default `true`: scroll to the top). Set
   * `false` when the caller manages scrolling itself.
   */
  scroll?: boolean;
  className?: string;
}

type PageItem = number | 'gap-start' | 'gap-end';

/** Pages around `current` (±1), always with the first/last; gaps as ellipses. */
export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  const middle = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  return [
    1,
    ...(start > 2 ? (['gap-start'] as const) : []),
    ...middle,
    ...(end < total - 1 ? (['gap-end'] as const) : []),
    total,
  ];
}

const itemClassName = cn(
  'font-caption inline-flex size-10 items-center justify-center rounded-full text-sm tabular-nums',
  'duration-(--dur-normal) ease-subtle transition-colors',
  'focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
);

const arrowClassName = cn(itemClassName, 'text-foreground hover:bg-muted');
const disabledArrowClassName = cn(
  itemClassName,
  'text-muted-foreground opacity-40',
);

/**
 * Numbered page links (crawlable, prefetched): ‹ 1 … 4 5 6 … 12 ›.
 * The current page is filled with the brand colour; other pages already on
 * screen (after "Load more") get a soft tint. Fixed-size items, so the row
 * never shifts between pages.
 */
export function Pagination({
  hrefs,
  current,
  rangeStart = current,
  labels,
  scroll = true,
  className,
}: PaginationProps) {
  const total = hrefs.length;
  if (total <= 1) {
    return null;
  }

  const previousHref = hrefs[rangeStart - 2];
  const nextHref = hrefs[current];

  return (
    <nav aria-label={labels.nav} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li className="flex">
          {previousHref ? (
            <AppLink
              href={previousHref}
              scroll={scroll}
              aria-label={labels.previous}
              className={arrowClassName}
            >
              <Icon name="chevron-left" aria-hidden="true" className="size-4" />
            </AppLink>
          ) : (
            <span aria-hidden="true" className={disabledArrowClassName}>
              <Icon name="chevron-left" className="size-4" />
            </span>
          )}
        </li>

        {getPageItems(current, total).map(item => {
          if (typeof item === 'string') {
            return (
              <li key={item} aria-hidden="true" className="flex">
                <span className={cn(itemClassName, 'text-muted-foreground')}>
                  …
                </span>
              </li>
            );
          }

          const href = hrefs[item - 1];
          const isCurrent = item === current;
          const isLoaded = !isCurrent && item >= rangeStart && item < current;
          return (
            <li key={item} className="flex">
              {href && (
                <AppLink
                  href={href}
                  scroll={scroll}
                  aria-label={labels.page(item)}
                  aria-current={isCurrent ? 'page' : undefined}
                  data-loaded={isLoaded || undefined}
                  className={cn(
                    itemClassName,
                    'aria-[current=page]:bg-action-primary aria-[current=page]:text-action-primary-foreground aria-[current=page]:font-medium',
                    'not-aria-[current=page]:text-foreground not-aria-[current=page]:hover:bg-muted',
                    'data-loaded:bg-muted data-loaded:font-medium',
                  )}
                >
                  {item}
                </AppLink>
              )}
            </li>
          );
        })}

        <li className="flex">
          {nextHref ? (
            <AppLink
              href={nextHref}
              scroll={scroll}
              aria-label={labels.next}
              className={arrowClassName}
            >
              <Icon
                name="chevron-right"
                aria-hidden="true"
                className="size-4"
              />
            </AppLink>
          ) : (
            <span aria-hidden="true" className={disabledArrowClassName}>
              <Icon name="chevron-right" className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
