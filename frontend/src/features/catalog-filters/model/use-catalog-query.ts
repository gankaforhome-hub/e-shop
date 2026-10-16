'use client';

import { useMemo, useOptimistic, useTransition } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  type CatalogQuery,
  parseCatalogQuery,
  serializeCatalogQuery,
} from '@/entities/product/catalog';
import { routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';

/**
 * Catalog URL state: the search params are the single source of truth, parsed
 * through type guards. `navigate` updates them with a soft navigation (no
 * reload, scroll kept) and reflects the change optimistically meanwhile.
 * Must render inside `<Suspense>` (reads `useSearchParams`).
 */
export function useCatalogQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(
    () => parseCatalogQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(query);

  const navigate = (next: CatalogQuery) => {
    startTransition(() => {
      setOptimisticQuery(next);
      router.push(routes.products(serializeCatalogQuery(next)), {
        scroll: false,
      });
    });
  };

  return { query: optimisticQuery, isPending, navigate };
}
