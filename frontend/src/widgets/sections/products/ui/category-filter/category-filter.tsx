import { type CategoryDTO } from '@/entities/category';
import {
  type CategorySlug,
  type ProductSort,
  routes,
} from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';

interface CategoryFilterProps {
  categories: CategoryDTO[];
  labels: {
    /** Accessible name of the category nav ("Category"). */
    nav: string;
    /** First link, clears the category ("All"). */
    all: string;
  };
  /** Active category slug from the URL (server-resolved; no client JS needed). */
  activeCategory?: CategorySlug | undefined;
  /** Preserved when switching categories; category-specific filters reset. */
  search?: string | undefined;
  sort?: ProductSort | undefined;
  /** `center` in the desktop toolbar, `start` inside the filter sheet. */
  align?: 'center' | 'start';
  /** `title` matches the product card title; `small` (14px) inside the filter sheet. */
  size?: 'title' | 'small';
}

// Same type as the product card title (font, size, weight, colour). Active =
// underline only, no weight change: the text width stays the same, so the row
// never reflows when the active category switches
const linkClassName = cn(
  'font-caption text-foreground relative inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-sm text-sm font-normal tracking-wide',
  'duration-(--dur-normal) ease-subtle transition-opacity',
  'focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-4',
  'after:bg-action-primary after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0',
  'after:duration-(--dur-normal) after:ease-subtle after:transition-transform motion-reduce:after:transition-none',
  'aria-[current=page]:after:scale-x-100',
  'not-aria-[current=page]:hover:opacity-70',
);

/**
 * Single-select plain-text category links: one tap selects, tapping the
 * active one returns to all products. The active link comes from the
 * server-parsed `?category=` (e.g. a home-page category card), so it is right
 * on first paint. Fixed row height, so nothing shifts between states.
 */
export function CategoryFilter({
  categories,
  labels,
  activeCategory,
  search,
  sort,
  align = 'center',
  size = 'title',
}: CategoryFilterProps) {
  const className = cn(linkClassName, size === 'title' && 'md:text-base');

  return (
    <nav aria-label={labels.nav}>
      <ul
        className={cn(
          'flex flex-wrap gap-x-6 gap-y-1 md:gap-x-8',
          align === 'center' ? 'justify-center' : 'justify-start',
        )}
      >
        <li className="flex">
          <AppLink
            href={routes.products({ search, sort })}
            aria-current={activeCategory ? undefined : 'page'}
            className={className}
          >
            {labels.all}
          </AppLink>
        </li>
        {categories.map(category => {
          const isActive = activeCategory === category.slug;

          return (
            <li key={category.slug} className="flex">
              <AppLink
                href={routes.products({
                  category: isActive ? undefined : category.slug,
                  search,
                  sort,
                })}
                aria-current={isActive ? 'page' : undefined}
                className={className}
              >
                {category.title}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
