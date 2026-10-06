'use client';

import { useSearchParams } from 'next/navigation';

import { type CategoryDTO } from '@/entities/category';
import { ProductSearch } from '@/features/product-search/ui/product-search';
import { type CategorySlug, routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';

interface ICategoryFilterProps {
  categories: CategoryDTO[];
}

export function CategoryFilter({ categories }: ICategoryFilterProps) {
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') as CategorySlug | null;
  const currentSearch = searchParams.get('search') || undefined;
  const currentSort = searchParams.get('sort') as 'price' | 'name' | undefined;

  const getCategoryHref = (catSlug: CategorySlug) => {
    const isCurrentActive = activeCategory === catSlug;

    return routes.products({
      category: isCurrentActive ? undefined : catSlug,
      search: currentSearch,
      sort: currentSort,
      page: undefined,
    });
  };

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Компонент Пошуку */}
        <ProductSearch />

        {/* Навігація по категоріях */}
        <nav className="scrollbar-none flex items-center gap-4 overflow-x-auto px-2 sm:gap-6">
          {categories.map(cat => {
            const isActive = activeCategory === cat.slug;

            return (
              <AppLink
                key={cat.slug}
                href={getCategoryHref(cat.slug as CategorySlug)}
                className={cn(
                  'whitespace-nowrap text-sm font-medium transition-colors hover:text-black',
                  isActive
                    ? 'font-semibold text-black underline decoration-black decoration-2 underline-offset-8'
                    : 'text-gray-500',
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
