import { type CategoryDTO } from '@/entities/category';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';

interface CategoryFilterProps {
  categories: CategoryDTO[];
  /** Active category slug from the URL (server-resolved; no client JS needed). */
  activeCategory?: string;
  /** Current search term, preserved when switching categories. */
  search?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
  search,
}: CategoryFilterProps) {
  return (
    <div className="px-4 py-8">
      <div className="border-border flex items-center justify-between border-b pb-4">
        <nav className="scrollbar-none flex items-center gap-4 overflow-x-auto px-2 sm:gap-6">
          {categories.map(cat => {
            const isActive = activeCategory === cat.slug;

            return (
              <AppLink
                key={cat.slug}
                href={routes.products({
                  category: isActive ? undefined : cat.slug,
                  search,
                })}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'duration-(--dur-normal) whitespace-nowrap text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground decoration-foreground font-semibold underline decoration-2 underline-offset-8'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {cat.title}
              </AppLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
