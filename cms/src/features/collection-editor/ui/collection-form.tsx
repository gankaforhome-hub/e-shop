'use client';

import { type ComponentType, useState } from 'react';

import { flushSync } from 'react-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import {
  getCollectionTitle,
  type AdminCollection,
  type CollectionLocale,
  type Season,
} from '@/entities/collection';
import { type Media } from '@/entities/media';
import { routes } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FormField } from '@/shared/ui/form-field';
import { Heading } from '@/shared/ui/heading';
import { Input } from '@/shared/ui/input';
import { Segmented, segmentedItemVariants } from '@/shared/ui/segmented';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';
import { Textarea } from '@/shared/ui/textarea';

import { DeleteCollectionButton } from './delete-collection-button';
import {
  createCollectionAction,
  updateCollectionAction,
  type CollectionErrorField,
} from '../api/collection-actions';
import {
  COLLECTION_LOCALES,
  collectionFormSchema,
  toCollectionInput,
  toFormValues,
  type CollectionErrorKey,
  type CollectionFormInput,
  type CollectionFormValues,
} from '../model/collection.schema';

/** The image picker the page plugs in (`MediaField` of `features/upload-media`). */
export interface ImageFieldProps {
  label: string;
  value: Media | null;
  onChange: (media: Media | null) => void;
  aspect: '570/585' | '16/9';
  disabled?: boolean;
}

/** "Create a season" control the page plugs in (`SeasonDialog` of `features/season-editor`). */
export interface SeasonCreatorProps {
  /** Position for the new season: after the existing ones. */
  nextSortOrder: number;
  onCreated: (season: Season) => void;
}

export interface CollectionFormProps {
  /** Absent: a new collection. */
  collection?: AdminCollection;
  seasons: Season[];
  ImageField: ComponentType<ImageFieldProps>;
  SeasonCreator?: ComponentType<SeasonCreatorProps>;
}

const SERVER_FIELDS: readonly CollectionErrorField[] = ['slug', 'seasonSlug'];

export function CollectionForm({
  collection,
  seasons,
  ImageField,
  SeasonCreator,
}: CollectionFormProps) {
  const t = useTranslations('collections');
  const [locale, setLocale] = useState<CollectionLocale>('uk');
  // Seasons created from this form join the list without a page reload
  const [seasonOptions, setSeasonOptions] = useState(seasons);
  const [formError, setFormError] = useState<CollectionErrorKey | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CollectionFormInput, unknown, CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: toFormValues(collection),
    mode: 'onTouched',
  });

  const errorText = (message?: string) =>
    message ? t(`errors.${message as CollectionErrorKey}`) : undefined;

  const onSubmit = handleSubmit(
    async values => {
      setFormError(null);
      setSaved(false);
      const input = toCollectionInput(values);
      // A new collection: on success the action opens its editor and does not return
      const result = collection
        ? await updateCollectionAction(collection.id, input)
        : await createCollectionAction(input);

      if (result.ok) {
        reset(toFormValues(result.collection));
        setSaved(true);
        return;
      }
      SERVER_FIELDS.forEach(field => {
        const message = result.fieldErrors?.[field];
        if (message) {
          setError(field, { message }, { shouldFocus: true });
        }
      });
      setFormError(result.formError ?? null);
    },
    // Hidden language fields can't take focus: show the language that has the error
    invalid => {
      const failed = COLLECTION_LOCALES.find(
        item => invalid.translations?.[item],
      );
      if (failed) {
        setLocale(failed);
      }
    },
  );

  const fieldId = (name: string) => `collection-${name}`;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <div className="flex flex-col gap-6">
        <Card>
          <Heading headingLevel="h2" variant="card">
            {t('form.main')}
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id={fieldId('slug')}
              label={t('form.slug')}
              hint={t('form.slugHint')}
              error={errorText(errors.slug?.message)}
            >
              <Input
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                {...register('slug')}
              />
            </FormField>
            <FormField
              id={fieldId('sku-prefix')}
              label={t('form.skuPrefix')}
              hint={
                collection
                  ? t('form.skuPrefixHint')
                  : t('form.skuPrefixNewHint')
              }
            >
              {/* Assigned by the API (two digits in creation order): shown, never sent */}
              <Input
                readOnly
                value={collection?.skuPrefix ?? ''}
                placeholder={t('form.skuPrefixAuto')}
                className="font-mono read-only:bg-muted"
              />
            </FormField>
            <div className="flex flex-col gap-1.5">
              <FormField
                id={fieldId('season')}
                label={t('form.season')}
                error={errorText(errors.seasonSlug?.message)}
              >
                <Select {...register('seasonSlug')}>
                  <option value="">{t('form.noSeason')}</option>
                  {seasonOptions.map(season => (
                    <option key={season.slug} value={season.slug}>
                      {season.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              {SeasonCreator ? (
                <SeasonCreator
                  nextSortOrder={
                    Math.max(0, ...seasonOptions.map(item => item.sortOrder)) +
                    1
                  }
                  onCreated={season => {
                    // The select is uncontrolled: its new <option> must exist before
                    // react-hook-form writes the value into the DOM
                    flushSync(() =>
                      setSeasonOptions(current =>
                        [...current, season].toSorted(
                          (a, b) => a.sortOrder - b.sortOrder,
                        ),
                      ),
                    );
                    setValue('seasonSlug', season.slug, { shouldDirty: true });
                  }}
                />
              ) : null}
            </div>
            <FormField
              id={fieldId('sort-order')}
              label={t('form.sortOrder')}
              hint={t('form.sortOrderHint')}
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
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-primary"
              {...register('isActive')}
            />
            <span className="flex flex-col gap-0.5">
              <Text as="span" size="sm" weight="medium">
                {t('form.isActive')}
              </Text>
              <Text as="span" size="xs" variant="muted">
                {t('form.isActiveHint')}
              </Text>
            </span>
          </label>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Heading headingLevel="h2" variant="card">
              {t('form.texts')}
            </Heading>
            <Segmented aria-label={t('form.language')} className="w-40">
              {COLLECTION_LOCALES.map(item => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={locale === item}
                  onClick={() => setLocale(item)}
                  className={segmentedItemVariants({ active: locale === item })}
                >
                  {t(`form.locales.${item}`)}
                  {errors.translations?.[item] ? (
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-destructive"
                    />
                  ) : null}
                </button>
              ))}
            </Segmented>
          </div>
          <Text size="xs" variant="muted">
            {t(locale === 'uk' ? 'form.ukHint' : 'form.enHint')}
          </Text>

          {COLLECTION_LOCALES.map(item => {
            const fieldErrors = errors.translations?.[item];
            const id = (name: string) => fieldId(`${item}-${name}`);

            return (
              <div
                key={item}
                hidden={locale !== item}
                lang={item}
                className="flex flex-col gap-4"
              >
                <FormField
                  id={id('title')}
                  label={t('form.title')}
                  error={errorText(fieldErrors?.title?.message)}
                >
                  <Input {...register(`translations.${item}.title`)} />
                </FormField>
                <FormField
                  id={id('short-description')}
                  label={t('form.shortDescription')}
                  hint={t('form.shortDescriptionHint')}
                  error={errorText(fieldErrors?.shortDescription?.message)}
                >
                  <Textarea
                    rows={2}
                    {...register(`translations.${item}.shortDescription`)}
                  />
                </FormField>
                <FormField
                  id={id('description')}
                  label={t('form.description')}
                  hint={t('form.descriptionHint')}
                  error={errorText(fieldErrors?.description?.message)}
                >
                  <Textarea
                    rows={6}
                    {...register(`translations.${item}.description`)}
                  />
                </FormField>
                <FormField
                  id={id('meta-title')}
                  label={t('form.metaTitle')}
                  hint={t('form.metaTitleHint')}
                  error={errorText(fieldErrors?.metaTitle?.message)}
                >
                  <Input
                    maxLength={120}
                    {...register(`translations.${item}.metaTitle`)}
                  />
                </FormField>
                <FormField
                  id={id('meta-description')}
                  label={t('form.metaDescription')}
                  hint={t('form.metaDescriptionHint')}
                  error={errorText(fieldErrors?.metaDescription?.message)}
                >
                  <Textarea
                    rows={2}
                    maxLength={320}
                    {...register(`translations.${item}.metaDescription`)}
                  />
                </FormField>
              </div>
            );
          })}
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <Heading headingLevel="h2" variant="card">
            {t('form.images')}
          </Heading>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageField
                label={t('form.cover')}
                aspect="570/585"
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </Card>

        {collection ? (
          // The home hero is managed on the Banners page; here only how many slides link here
          <Card>
            <Heading headingLevel="h2" variant="card">
              {t('form.hero')}
            </Heading>
            <Text size="sm" variant="muted">
              {t('form.inBanners', { count: collection.bannerCount })}
            </Text>
            <AppLink
              href={routes.content.banners}
              className="w-fit text-sm font-medium text-brand hover:underline"
            >
              {t('form.toBanners')}
            </AppLink>
          </Card>
        ) : null}
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-3 border-t border-border pt-6 xl:col-span-2',
          collection ? 'justify-between' : 'justify-end',
        )}
      >
        {collection ? (
          <DeleteCollectionButton
            id={collection.id}
            title={getCollectionTitle(collection)}
          />
        ) : null}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {formError ? (
            <Text role="alert" size="sm" variant="destructive">
              {t(`errors.${formError}`)}
            </Text>
          ) : null}
          {saved && !isDirty ? (
            <Text role="status" size="sm" variant="muted">
              {t('form.saved')}
            </Text>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('form.saving')
              : collection
                ? t('form.save')
                : t('form.create')}
          </Button>
        </div>
      </div>
    </form>
  );
}
