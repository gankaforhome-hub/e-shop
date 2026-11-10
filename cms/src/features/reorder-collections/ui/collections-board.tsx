'use client';

import { useEffect, useId, useMemo, useState, useTransition } from 'react';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useTranslations } from 'next-intl';

import {
  type AdminCollection,
  getCollectionTitle,
  type Season,
} from '@/entities/collection';
import { useRouter } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Segmented, segmentedItemVariants } from '@/shared/ui/segmented';
import { Text } from '@/shared/ui/text';

import { CollectionRow } from './collection-row';
import {
  type OrderErrorKey,
  saveCollectionOrderAction,
} from '../api/order-actions';
import {
  type BannerFilter,
  canReorder,
  type CollectionSort,
  DEFAULT_VIEW,
  isSameOrder,
  type ListView,
  matchesFilters,
  sortCollections,
  type VisibilityFilter,
} from '../lib/list-view';

interface CollectionsBoardProps {
  /** In the saved order (`sortOrder`). */
  collections: AdminCollection[];
  seasons: Season[];
}

const SORTS: readonly CollectionSort[] = ['custom', 'alpha', 'newest'];
const VISIBILITY: readonly VisibilityFilter[] = ['all', 'visible', 'hidden'];
const BANNER: readonly BannerFilter[] = ['all', 'in', 'out'];

/**
 * The collection list: drag rows to change the order (saved order, no filters), sort A–Z or
 * by newest and filter by visibility or hero just to look. A changed order is a draft until
 * "Save order"; a sorted view can be copied into the draft with "Use as order".
 */
export function CollectionsBoard({
  collections,
  seasons,
}: CollectionsBoardProps) {
  const t = useTranslations('collections.board');
  const tTable = useTranslations('collections.table');
  const router = useRouter();
  const savedOrder = useMemo(
    () => collections.map(item => item.id),
    [collections],
  );
  const [order, setOrder] = useState(savedOrder);
  const [view, setView] = useState<ListView>(DEFAULT_VIEW);
  const [error, setError] = useState<OrderErrorKey | null>(null);
  const [isSaving, startSaving] = useTransition();
  // dnd-kit numbers its aria-describedby ids with a global counter, which differs between
  // the server and the client render: a stable id avoids the hydration mismatch
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const isDirty = !isSameOrder(order, savedOrder);
  const draggable = canReorder(view);
  const seasonLabels = new Map(seasons.map(({ slug, label }) => [slug, label]));
  const sorted = sortCollections(collections, view.sort, order);
  const shown = sorted.filter(item => matchesFilters(item, view));
  const titleOf = (id: string | number) => {
    const collection = collections.find(item => item.id === id);
    return collection ? getCollectionTitle(collection) : String(id);
  };

  // Leaving the page would drop the unsaved order: let the browser ask first
  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }
    setOrder(current =>
      arrayMove(
        current,
        current.indexOf(String(active.id)),
        current.indexOf(String(over.id)),
      ),
    );
  };

  const applySortedOrder = () => {
    setOrder(sorted.map(item => item.id));
    setView(DEFAULT_VIEW);
  };

  const save = () =>
    startSaving(async () => {
      setError(null);
      const result = await saveCollectionOrderAction(order);
      if (result.ok) {
        // New props remount the board (keyed by the saved order on the page)
        router.refresh();
      } else {
        setError(result.error);
      }
    });

  const setFilter = <Key extends keyof ListView>(
    key: Key,
    value: ListView[Key],
  ) => setView(current => ({ ...current, [key]: value }));

  const head =
    'px-3 py-2.5 text-left text-xs font-medium text-muted-foreground';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <Text as="span" size="xs" variant="muted" id="collections-sort">
            {t('sortLabel')}
          </Text>
          <Segmented aria-labelledby="collections-sort">
            {SORTS.map(sort => (
              <button
                key={sort}
                type="button"
                aria-pressed={view.sort === sort}
                onClick={() => setFilter('sort', sort)}
                className={cn(
                  'whitespace-nowrap',
                  segmentedItemVariants({
                    active: view.sort === sort,
                  }),
                )}
              >
                {t(`sort.${sort}`)}
              </button>
            ))}
          </Segmented>
        </div>
        <div className="flex flex-col gap-1.5">
          <Text as="span" size="xs" variant="muted" id="collections-visibility">
            {t('visibilityLabel')}
          </Text>
          <Segmented aria-labelledby="collections-visibility">
            {VISIBILITY.map(value => (
              <button
                key={value}
                type="button"
                aria-pressed={view.visibility === value}
                onClick={() => setFilter('visibility', value)}
                className={cn(
                  'whitespace-nowrap',
                  segmentedItemVariants({
                    active: view.visibility === value,
                  }),
                )}
              >
                {t(`visibility.${value}`)}
              </button>
            ))}
          </Segmented>
        </div>
        <div className="flex flex-col gap-1.5">
          <Text as="span" size="xs" variant="muted" id="collections-banner">
            {t('bannerLabel')}
          </Text>
          <Segmented aria-labelledby="collections-banner">
            {BANNER.map(value => (
              <button
                key={value}
                type="button"
                aria-pressed={view.banner === value}
                onClick={() => setFilter('banner', value)}
                className={cn(
                  'whitespace-nowrap',
                  segmentedItemVariants({
                    active: view.banner === value,
                  }),
                )}
              >
                {t(`banner.${value}`)}
              </button>
            ))}
          </Segmented>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text size="sm" variant="muted" role="status">
          {draggable
            ? t('hintDrag')
            : view.sort === 'custom'
              ? t('hintFiltered')
              : t('hintSorted')}
        </Text>
        {view.sort !== 'custom' &&
        view.visibility === 'all' &&
        view.banner === 'all' ? (
          <Button variant="link" size="inline" onClick={applySortedOrder}>
            {t('useAsOrder')}
          </Button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="collections"
          title={t('noMatches.title')}
          description={t('noMatches.description')}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            accessibility={{
              screenReaderInstructions: { draggable: t('a11y.instructions') },
              announcements: {
                onDragStart: ({ active }) =>
                  t('a11y.picked', { title: titleOf(active.id) }),
                onDragOver: ({ active, over }) =>
                  over
                    ? t('a11y.over', {
                        title: titleOf(active.id),
                        position: order.indexOf(String(over.id)) + 1,
                      })
                    : undefined,
                onDragEnd: ({ active, over }) =>
                  over
                    ? t('a11y.dropped', {
                        title: titleOf(active.id),
                        position: order.indexOf(String(over.id)) + 1,
                      })
                    : undefined,
                onDragCancel: ({ active }) =>
                  t('a11y.cancelled', { title: titleOf(active.id) }),
              },
            }}
          >
            <table className="w-full min-w-3xl border-collapse text-sm">
              <thead className="border-b border-border">
                <tr>
                  {draggable ? (
                    <th scope="col" className={cn(head, 'w-10')}>
                      <span className="sr-only">{t('dragColumn')}</span>
                    </th>
                  ) : null}
                  <th scope="col" className={cn(head, 'w-10 text-right')}>
                    #
                  </th>
                  <th scope="col" className={cn(head, 'w-16')}>
                    <span className="sr-only">{tTable('preview')}</span>
                  </th>
                  <th scope="col" className={head}>
                    {tTable('title')}
                  </th>
                  <th scope="col" className={head}>
                    {tTable('sku')}
                  </th>
                  <th scope="col" className={head}>
                    {tTable('status')}
                  </th>
                  <th scope="col" className={head}>
                    {tTable('season')}
                  </th>
                  <th scope="col" className={head}>
                    {tTable('banner')}
                  </th>
                  <th scope="col" className={head}>
                    <span className="sr-only">{tTable('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={shown.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                  disabled={!draggable}
                >
                  {shown.map((collection, index) => (
                    <CollectionRow
                      key={collection.id}
                      collection={collection}
                      position={index + 1}
                      draggable={draggable}
                      seasonLabel={
                        collection.seasonSlug
                          ? (seasonLabels.get(collection.seasonSlug) ??
                            collection.seasonSlug)
                          : undefined
                      }
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      )}

      {isDirty ? (
        <div
          role="region"
          aria-label={t('saveBarLabel')}
          className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
        >
          <Text size="sm" weight="medium">
            {t('unsaved')}
          </Text>
          <div className="flex flex-wrap items-center gap-2">
            {error ? (
              <Text role="alert" size="sm" variant="destructive">
                {t(`errors.${error}`)}
              </Text>
            ) : null}
            <Button
              variant="ghost"
              disabled={isSaving}
              onClick={() => {
                setOrder(savedOrder);
                setError(null);
              }}
            >
              {t('discard')}
            </Button>
            <Button disabled={isSaving} onClick={save}>
              {isSaving ? t('saving') : t('save')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
