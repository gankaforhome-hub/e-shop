'use client';

import {
  Fragment,
  type MouseEvent,
  type ReactNode,
  useState,
  useTransition,
} from 'react';

import { useTranslations } from 'next-intl';

import { type AppRoutes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { scrollToTopIfHidden } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Pagination } from '@/shared/ui/pagination';
import { Text } from '@/shared/ui/text';

interface CatalogFeedProps {
  /** Server-rendered grid of the current `?page=` (one batch). */
  children: ReactNode;
  page: number;
  total: number;
  pageSize: number;
  /** URL of every page of this query (`pageHrefs[0]` = page 1). */
  pageHrefs: readonly AppRoutes[];
  /** Query identity without the page; a change starts a fresh list. */
  queryKey: string;
  /** `id` of the catalog-top anchor that page links scroll back to. */
  scrollAnchorId: string;
  /** Grid skeleton shown below the list while the next batch loads. */
  skeleton: ReactNode;
}

type Batch = { page: number; grid: ReactNode };

/**
 * Hybrid pagination (Rozetka/Amazon style). The URL is the source of truth:
 * `?page=N` server-renders page N only (shareable, reload-safe, crawlable via
 * the numbered links). "Load more" replaces the URL with `?page=N+1` without
 * scrolling; the page keeps its client state across query-only navigations,
 * so the new server batch is appended to the ones already shown. Any other
 * change (numbered link, previous page, filters, sort, back button) shows just
 * the requested page and brings the grid top back into view.
 */
export function CatalogFeed({
  children,
  page,
  total,
  pageSize,
  pageHrefs,
  queryKey,
  scrollAnchorId,
  skeleton,
}: CatalogFeedProps) {
  const t = useTranslations('common.catalog.pagination');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [batches, setBatches] = useState<Batch[]>([{ page, grid: children }]);
  /** Page requested by "Load more"; only that navigation appends. */
  const [appendPage, setAppendPage] = useState<number | null>(null);
  const [synced, setSynced] = useState({ page, queryKey, grid: children });

  // Adjust state while rendering when the server sends a new batch
  if (synced.grid !== children) {
    const isSameQuery = synced.queryKey === queryKey;
    if (isSameQuery && synced.page === page) {
      // Same page re-rendered (e.g. favorites refresh): update it in place
      setBatches(current =>
        current.map(batch =>
          batch.page === page ? { page, grid: children } : batch,
        ),
      );
    } else if (isSameQuery && appendPage === page) {
      setBatches(current => [...current, { page, grid: children }]);
    } else {
      setBatches([{ page, grid: children }]);
    }
    setAppendPage(null);
    setSynced({ page, queryKey, grid: children });
  }

  const firstPage = batches[0]?.page ?? page;
  const lastPage = batches.at(-1)?.page ?? page;
  const from = (firstPage - 1) * pageSize + 1;
  const to = Math.min(lastPage * pageSize, total);
  const nextHref = pageHrefs[lastPage];

  const loadMore = () => {
    if (!nextHref) {
      return;
    }
    startTransition(() => {
      setAppendPage(lastPage + 1);
      router.replace(nextHref, { scroll: false });
    });
  };

  // Page links replace the list: show its top (plain clicks only, not new tabs)
  const handleLinkClick = (event: MouseEvent<HTMLElement>) => {
    const isPlainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
    if (
      isPlainClick &&
      event.target instanceof Element &&
      event.target.closest('a')
    ) {
      scrollToTopIfHidden(document.getElementById(scrollAnchorId));
    }
  };
  const previousHref = pageHrefs[firstPage - 2];

  return (
    <>
      {previousHref && (
        <div
          className="mb-6 flex justify-center"
          onClickCapture={handleLinkClick}
        >
          <Button asChild variant="link" size="small" className="gap-1">
            <AppLink href={previousHref} scroll={false}>
              <Icon name="chevron-up" aria-hidden="true" className="size-4" />
              {t('showPrevious')}
            </AppLink>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4" aria-busy={isPending}>
        {batches.map(batch => (
          <Fragment key={batch.page}>{batch.grid}</Fragment>
        ))}
        {isPending && skeleton}
      </div>

      <div
        className="mt-10 flex flex-col items-center gap-5 md:mt-14"
        onClickCapture={handleLinkClick}
      >
        {to < total && (
          <Button
            variant="outline"
            size="small"
            disabled={isPending}
            onClick={loadMore}
            className="min-w-48 gap-2"
          >
            {isPending && (
              <Icon
                name="spinner"
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            )}
            {isPending ? t('loading') : t('loadMore')}
          </Button>
        )}

        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          <Text
            as="p"
            size="none"
            variant="muted"
            font="secondary"
            aria-live="polite"
            className="text-xs tabular-nums sm:text-sm"
          >
            {from === 1
              ? t('progress', { shown: to, total })
              : t('progressRange', { from, to, total })}
          </Text>
          <div
            aria-hidden="true"
            className="bg-muted h-0.5 w-full rounded-full"
          >
            <div
              className="bg-action-primary duration-(--dur-slow) ease-subtle h-full rounded-full transition-[width]"
              // Progress ratio is data, not a design token
              style={{ width: `${total > 0 ? (to / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <Pagination
          hrefs={pageHrefs}
          current={lastPage}
          rangeStart={firstPage}
          scroll={false}
          labels={{
            nav: t('nav'),
            previous: t('previous'),
            next: t('next'),
            page: value => t('page', { page: value }),
          }}
          className="mt-2"
        />
      </div>
    </>
  );
}
