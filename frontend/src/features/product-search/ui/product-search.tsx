'use client';

import { useEffect, useRef, useTransition } from 'react';

import { useSearchParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { isCategorySlug, isProductSort, routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';

const SEARCH_DEBOUNCE_MS = 350;

interface ProductSearchProps {
  className?: string;
}

/**
 * Catalog search box. Debounces typing and navigates with the locale-aware
 * router, keeping the active category/sort and resetting pagination.
 * Must be rendered inside `<Suspense>` (reads `useSearchParams`).
 */
export function ProductSearch({ className }: ProductSearchProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const category = searchParams.get('category');
  const sort = searchParams.get('sort');

  // Cancel a pending navigation if the component unmounts mid-debounce
  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const navigate = (term: string) => {
    const targetUrl = routes.products({
      search: term.trim() || undefined,
      category: isCategorySlug(category) ? category : undefined,
      sort: isProductSort(sort) ? sort : undefined,
      page: undefined,
    });
    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  };

  const scheduleNavigate = (term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => navigate(term), SEARCH_DEBOUNCE_MS);
  };

  return (
    <div role="search" className={cn('relative w-full max-w-xs', className)}>
      <Input
        type="search"
        aria-label={t('action.search')}
        placeholder={t('placeholder.search')}
        defaultValue={searchParams.get('search') ?? ''}
        onChange={e => scheduleNavigate(e.target.value)}
        className="pr-8"
      />
      <Icon
        name={isPending ? 'spinner' : 'search'}
        aria-hidden="true"
        className={cn(
          'text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2',
          isPending && 'animate-spin',
        )}
      />
    </div>
  );
}
