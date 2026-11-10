'use client';

import { useState, useTransition } from 'react';

import { useTranslations } from 'next-intl';

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
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { deleteCollectionAction } from '../api/collection-actions';
import { type CollectionErrorKey } from '../model/collection.schema';

interface DeleteCollectionButtonProps {
  id: string;
  title: string;
}

/** Delete with a confirmation dialog; on success the action returns to the list. */
export function DeleteCollectionButton({
  id,
  title,
}: DeleteCollectionButtonProps) {
  const t = useTranslations('collections');
  const [error, setError] = useState<CollectionErrorKey | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      setError(null);
      // On success the action redirects and does not return
      const result = await deleteCollectionAction(id);
      if (!result.ok) {
        setError(result.formError ?? 'serverError');
      }
    });

  return (
    <AlertDialog onOpenChange={open => open && setError(null)}>
      <AlertDialogTrigger asChild>
        <Button variant="ghostDestructive">
          <Icon name="delete" />
          {t('delete.button')}
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
              {t('delete.cancel')}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            // Keeps the dialog open while the request runs and on errors
            onClick={event => {
              event.preventDefault();
              confirm();
            }}
          >
            <Button variant="destructive" disabled={isPending}>
              {isPending ? t('delete.deleting') : t('delete.confirm')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
