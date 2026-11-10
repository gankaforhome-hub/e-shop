'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTranslations } from 'next-intl';

import {
  type AdminCollection,
  getCollectionTitle,
  getCoverThumbnail,
} from '@/entities/collection';
import { routes } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

interface CollectionRowProps {
  collection: AdminCollection;
  /** 1-based place in the shown list. */
  position: number;
  seasonLabel?: string;
  draggable: boolean;
}

export const ROW_CELL = 'px-3 py-2.5 align-middle';

/** One collection in the list; draggable by its handle in the saved order. */
export function CollectionRow({
  collection,
  position,
  seasonLabel,
  draggable,
}: CollectionRowProps) {
  const t = useTranslations('collections');
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: collection.id, disabled: !draggable });
  const thumbnail = getCoverThumbnail(collection);
  const title = getCollectionTitle(collection);

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={cn(
        'border-b border-border bg-card last:border-b-0',
        isDragging && 'relative z-10 shadow-lg',
      )}
    >
      {draggable ? (
        <td className={cn(ROW_CELL, 'w-10 pr-0')}>
          <button
            ref={setActivatorNodeRef}
            type="button"
            aria-label={t('board.dragHandle', { title })}
            className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground-emphasis focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <Icon name="drag-handle" />
          </button>
        </td>
      ) : null}
      <td
        className={cn(
          ROW_CELL,
          'w-10 text-right text-xs text-muted-foreground tabular-nums',
        )}
      >
        {position}
      </td>
      <td className={cn(ROW_CELL, 'w-16')}>
        <span className="block size-12 overflow-hidden rounded-md bg-muted">
          {thumbnail ? (
            // Storage files are served as they are: the CMS has no image optimizer
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail.publicUrl}
              alt=""
              loading="lazy"
              draggable={false}
              style={{ objectPosition: collection.coverImage?.objectPosition }}
              className="size-full object-cover"
            />
          ) : null}
        </span>
      </td>
      <td className={ROW_CELL}>
        <div className="flex flex-col gap-0.5">
          <AppLink
            href={routes.catalog.collection(collection.id)}
            className="font-medium text-foreground-emphasis hover:text-brand focus-visible:text-brand"
          >
            {title}
          </AppLink>
          <Text as="span" size="xs" variant="muted" className="font-mono">
            {collection.slug}
          </Text>
        </div>
      </td>
      <td className={cn(ROW_CELL, 'font-mono text-xs tabular-nums')}>
        {collection.skuPrefix}
      </td>
      <td className={ROW_CELL}>
        <Text
          as="span"
          size="xs"
          weight="medium"
          variant={collection.isActive ? 'default' : 'muted'}
        >
          {collection.isActive ? t('table.active') : t('table.hidden')}
        </Text>
      </td>
      <td className={ROW_CELL}>{seasonLabel ?? '—'}</td>
      <td className={ROW_CELL}>
        {collection.bannerCount > 0
          ? t('table.inBanners', { count: collection.bannerCount })
          : '—'}
      </td>
      <td className={cn(ROW_CELL, 'text-right')}>
        <Button asChild variant="ghost">
          <AppLink
            href={routes.catalog.collection(collection.id)}
            aria-label={t('board.editAria', { title })}
          >
            <Icon name="edit" />
            {t('board.edit')}
          </AppLink>
        </Button>
      </td>
    </tr>
  );
}
