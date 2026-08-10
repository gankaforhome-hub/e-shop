'use client';

import { useTransition } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { Icon } from '@/shared/ui/icon';
// твій Shadcn Input

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') as any;
  const currentSort = searchParams.get('sort') as any;

  const handleSearch = (term: string) => {
    const targetUrl = routes.products({
      search: term.trim() || undefined,
      category: currentCategory,
      sort: currentSort,
      // При новому пошуку скидаємо сторінку на 1-шу
      page: undefined,
    });

    startTransition(() => {
      router.push(targetUrl);
    });
  };

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="search"
        placeholder="Пошук посуду..."
        defaultValue={currentSearch}
        onChange={e => handleSearch(e.target.value)}
        className="pr-8"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon name="search" className="h-4 w-4" />
      </div>
    </div>
  );
}
