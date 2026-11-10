'use client';

import { type ReactNode, useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { type AdminSeason } from '@/entities/collection';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

import { createSeasonAction, updateSeasonAction } from '../api/season-actions';
import {
  seasonFormSchema,
  toSeasonFormValues,
  type SeasonErrorKey,
  type SeasonFormInput,
  type SeasonFormValues,
} from '../model/season.schema';

interface SeasonDialogProps {
  /** Absent: a new season. */
  season?: AdminSeason;
  /** Position a new season starts with (after the existing ones). */
  nextSortOrder?: number;
  /** The button that opens the dialog. */
  trigger: ReactNode;
  onSaved?: (season: AdminSeason) => void;
}

/** Create or edit a season in a modal; the slug is fixed once the season exists. */
export function SeasonDialog({
  season,
  nextSortOrder,
  trigger,
  onSaved,
}: SeasonDialogProps) {
  const t = useTranslations('seasons');
  const id = useId();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<SeasonErrorKey | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SeasonFormInput, unknown, SeasonFormValues>({
    resolver: zodResolver(seasonFormSchema),
    defaultValues: toSeasonFormValues(season, nextSortOrder),
    mode: 'onTouched',
  });

  const errorText = (message?: string) =>
    message ? t(`errors.${message as SeasonErrorKey}`) : undefined;

  const onOpenChange = (next: boolean) => {
    // Every opening starts from the stored values
    if (next) {
      reset(toSeasonFormValues(season, nextSortOrder));
      setFormError(null);
    }
    setOpen(next);
  };

  const onSubmit = handleSubmit(async values => {
    setFormError(null);
    const result = season
      ? await updateSeasonAction(season.slug, values)
      : await createSeasonAction(values);

    if (result.ok) {
      setOpen(false);
      onSaved?.(result.season);
      return;
    }
    if (result.field) {
      setError(result.field, { message: result.error }, { shouldFocus: true });
    } else {
      setFormError(result.error);
    }
  });

  const fieldId = (name: string) => `${id}-${name}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent closeLabel={t('dialog.close')}>
        <DialogTitle>
          {season ? t('dialog.editTitle') : t('dialog.newTitle')}
        </DialogTitle>
        <DialogDescription>{t('dialog.description')}</DialogDescription>
        <form
          onSubmit={event => {
            // The dialog may sit inside the collection form: keep its submit out of it
            event.stopPropagation();
            void onSubmit(event);
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormField
            id={fieldId('uk')}
            label={t('form.labelUk')}
            error={errorText(errors.labels?.uk?.message)}
          >
            <Input maxLength={50} {...register('labels.uk')} />
          </FormField>
          <FormField
            id={fieldId('en')}
            label={t('form.labelEn')}
            hint={t('form.labelEnHint')}
            error={errorText(errors.labels?.en?.message)}
          >
            <Input maxLength={50} lang="en" {...register('labels.en')} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id={fieldId('slug')}
              label={t('form.slug')}
              hint={season ? t('form.slugFixed') : t('form.slugHint')}
              error={errorText(errors.slug?.message)}
            >
              <Input
                autoComplete="off"
                spellCheck={false}
                readOnly={Boolean(season)}
                className="font-mono read-only:bg-muted"
                {...register('slug')}
              />
            </FormField>
            <FormField
              id={fieldId('sort-order')}
              label={t('form.sortOrder')}
              error={errorText(errors.sortOrder?.message)}
            >
              <Input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                {...register('sortOrder', { valueAsNumber: true })}
              />
            </FormField>
          </div>
          {formError ? (
            <Text role="alert" size="sm" variant="destructive">
              {t(`errors.${formError}`)}
            </Text>
          ) : null}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" disabled={isSubmitting}>
                {t('dialog.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('dialog.saving')
                : season
                  ? t('dialog.save')
                  : t('dialog.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
