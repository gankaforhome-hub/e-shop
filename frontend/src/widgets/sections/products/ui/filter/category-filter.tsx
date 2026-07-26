'use client';

import { useSearchParams } from 'next/navigation';

import { categories } from '@/entities/category/mock/categories';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div className="px-4 py-8">
      {/* Навігаційна панель категорій над списком товарів */}
      <div className="flex items-center justify-between border-b pb-4">
        {/* Sort drop down/button */}
        <div>{/* Sort Component */}</div>

        {/* Фіксація активної категорії */}
        <nav
          className={cn(
            'scrollbar-none flex items-center gap-4 overflow-x-auto px-2 sm:gap-6',
            // 'mb-6 flex flex-wrap justify-center gap-4',
          )}
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat.slug;

            return (
              <AppLink
                key={routes.products({ category: cat.slug })}
                href={isActive ? '/products' : `/products?category=${cat.slug}`}
                className={cn(
                  //   'bg-surface-muted/50 rounded-full px-4 py-1 text-base',
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

        <div>{/* Filter Component */}</div>
      </div>

      {/* Список продуктів */}
    </div>
  );
}
