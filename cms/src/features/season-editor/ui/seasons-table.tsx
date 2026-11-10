'use client';

import { useState, useTransition } from 'react';

import { useTranslations } from 'next-intl';

import { type AdminSeason } from '@/entities/collection';
import { useRouter } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { SeasonDialog } from './season-dialog';
import { deleteSeasonAction } from '../api/season-actions';
import { type SeasonErrorKey } from '../model/season.schema';

const labelOf = (season: AdminSeason, locale: 'uk' | 'en') =>
  season.translations.find(item => item.languageCode === locale)?.label;

function DeleteSeasonButton({ season }: { season: AdminSeason }) {
  const t = useTranslations('seasons');
  const router = useRouter();
  const [error, setError] = useState<SeasonErrorKey | null>(null);
  const [isPending, startTransition] = useTransition();
  const title = labelOf(season, 'uk') ?? season.slug;

  const confirm = () =>
    startTransition(async () => {
      setError(null);
      const result = await deleteSeasonAction(season.slug);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });

  return (
    <AlertDialog onOpenChange={open => open && setError(null)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghostDestructive"
          size="icon"
          aria-label={t('delete.button', { title })}
          // A season in use can't be deleted: say why instead of offering it
          disabled={season.collectionCount > 0}
          title={
            season.collectionCount > 0
              ? t('delete.inUseHint', { count: season.collectionCount })
              : undefined
          }
        >
          <Icon name="delete" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{t('delete.title', { title })}</AlertDialogTitle>
        <AlertDialogDescription>
          {t('delete.description')}
        </AlertDialogDescription>
        {error ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${error}`)}
          </Text>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost" disabled={isPending}>
              {t('dialog.cancel')}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={event => {
              event.preventDefault();
              confirm();
            }}
          >
            <Button variant="destructive" disabled={isPending}>
              {t('delete.confirm')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Seasons with their labels and usage; create, edit and delete in dialogs. */
export function SeasonsTable({ seasons }: { seasons: AdminSeason[] }) {
  const t = useTranslations('seasons');
  const router = useRouter();
  const refresh = () => router.refresh();
  const nextSortOrder =
    Math.max(0, ...seasons.map(season => season.sortOrder)) + 1;

  const head =
    'px-3 py-2.5 text-left text-xs font-medium text-muted-foreground';
  const cell = 'px-3 py-2.5 align-middle';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <SeasonDialog
          nextSortOrder={nextSortOrder}
          onSaved={refresh}
          trigger={
            <Button>
              <Icon name="add" />
              {t('new')}
            </Button>
          }
        />
      </div>
      {seasons.length === 0 ? (
        <EmptyState
          icon="seasons"
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-xl border-collapse text-sm">
            <thead className="border-b border-border">
              <tr>
                <th scope="col" className={head}>
                  {t('table.labelUk')}
                </th>
                <th scope="col" className={head}>
                  {t('table.labelEn')}
                </th>
                <th scope="col" className={head}>
                  {t('table.slug')}
                </th>
                <th scope="col" className={cn(head, 'text-right')}>
                  {t('table.collections')}
                </th>
                <th scope="col" className={cn(head, 'text-right')}>
                  {t('table.order')}
                </th>
                <th scope="col" className={cn(head, 'w-24')}>
                  <span className="sr-only">{t('table.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {seasons.map(season => (
                <tr
                  key={season.slug}
                  className="border-b border-border last:border-b-0"
                >
                  <td
                    className={cn(cell, 'font-medium text-foreground-emphasis')}
                  >
                    {labelOf(season, 'uk') ?? season.slug}
                  </td>
                  <td className={cell} lang="en">
                    {labelOf(season, 'en') ?? '—'}
                  </td>
                  <td className={cn(cell, 'font-mono text-xs')}>
                    {season.slug}
                  </td>
                  <td className={cn(cell, 'text-right tabular-nums')}>
                    {season.collectionCount}
                  </td>
                  <td className={cn(cell, 'text-right tabular-nums')}>
                    {season.sortOrder}
                  </td>
                  <td className={cell}>
                    <div className="flex justify-end gap-1">
                      <SeasonDialog
                        season={season}
                        onSaved={refresh}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t('edit', {
                              title: labelOf(season, 'uk') ?? season.slug,
                            })}
                          >
                            <Icon name="edit" />
                          </Button>
                        }
                      />
                      <DeleteSeasonButton season={season} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
