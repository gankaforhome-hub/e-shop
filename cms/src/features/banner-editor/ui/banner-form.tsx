'use client';

import { type ComponentType, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { useLocale, useTranslations } from 'next-intl';

import {
  type AdminBanner,
  type BannerLinkTarget,
  type BannerLocale,
  getLinkTargetTitle,
} from '@/entities/banner';
import { type Media } from '@/entities/media';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FormField } from '@/shared/ui/form-field';
import { Heading } from '@/shared/ui/heading';
import { Input } from '@/shared/ui/input';
import { Segmented, segmentedItemVariants } from '@/shared/ui/segmented';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';

import { DeleteBannerButton } from './delete-banner-button';
import {
  type BannerErrorField,
  createBannerAction,
  updateBannerAction,
} from '../api/banner-actions';
import { SCHEDULE_TIME_ZONE } from '../lib/kyiv-time';
import {
  BANNER_LOCALES,
  type BannerErrorKey,
  bannerFormSchema,
  type BannerFormInput,
  type BannerFormValues,
  toBannerFormValues,
  toBannerInput,
} from '../model/banner.schema';

/** The image picker the page plugs in (`MediaField` of `features/upload-media`). */
export interface BannerImageFieldProps {
  label: string;
  value: Media | null;
  onChange: (media: Media | null) => void;
  aspect: '16/9';
  disabled?: boolean;
}

export interface BannerFormProps {
  /** Absent: a new banner. */
  banner?: AdminBanner;
  linkTargets: BannerLinkTarget[];
  ImageField: ComponentType<BannerImageFieldProps>;
}

const SERVER_FIELDS: readonly BannerErrorField[] = [
  'collectionId',
  'url',
  'endsAt',
  'translations.uk.title',
];

export function BannerForm({
  banner,
  linkTargets,
  ImageField,
}: BannerFormProps) {
  const t = useTranslations('banners');
  const uiLocale = useLocale();
  const [locale, setLocale] = useState<BannerLocale>('uk');
  const [formError, setFormError] = useState<BannerErrorKey | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BannerFormInput, unknown, BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: toBannerFormValues(banner),
    mode: 'onTouched',
  });
  const linkType = useWatch({ control, name: 'linkType' });
  const collectionId = useWatch({ control, name: 'collectionId' });
  const target = linkTargets.find(item => item.id === collectionId);

  const errorText = (message?: string) =>
    message ? t(`errors.${message as BannerErrorKey}`) : undefined;

  const onSubmit = handleSubmit(
    async values => {
      setFormError(null);
      setSaved(false);
      const input = toBannerInput(values);
      // A new banner: on success the action opens its editor and does not return
      const result = banner
        ? await updateBannerAction(banner.id, input)
        : await createBannerAction(input);

      if (result.ok) {
        reset(toBannerFormValues(result.banner));
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
      const failed = BANNER_LOCALES.find(item => invalid.translations?.[item]);
      if (failed) {
        setLocale(failed);
      }
    },
  );

  const fieldId = (name: string) => `banner-${name}`;
  // What a slide without its own title shows: the collection's name in that language
  const fallbackTitle = (item: BannerLocale) =>
    linkType === 'COLLECTION' && target
      ? t('form.titleFromCollection', {
          title: getLinkTargetTitle(target, item),
        })
      : undefined;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <div className="flex flex-col gap-6">
        <Card>
          <Heading headingLevel="h2" variant="card">
            {t('form.link')}
          </Heading>
          <Segmented aria-label={t('form.linkType')} className="w-full sm:w-80">
            {(['COLLECTION', 'URL'] as const).map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={linkType === type}
                onClick={() =>
                  setValue('linkType', type, {
                    shouldDirty: true,
                    shouldValidate: false,
                  })
                }
                className={segmentedItemVariants({ active: linkType === type })}
              >
                {t(`form.linkTypes.${type}`)}
              </button>
            ))}
          </Segmented>
          {linkType === 'COLLECTION' ? (
            <FormField
              id={fieldId('collection')}
              label={t('form.collection')}
              hint={t('form.collectionHint')}
              error={errorText(errors.collectionId?.message)}
            >
              <Select {...register('collectionId')}>
                <option value="">{t('form.chooseCollection')}</option>
                {linkTargets.map(item => (
                  <option key={item.id} value={item.id}>
                    {getLinkTargetTitle(item, uiLocale)}
                    {item.isActive ? '' : ` (${t('form.hiddenCollection')})`}
                  </option>
                ))}
              </Select>
            </FormField>
          ) : (
            <FormField
              id={fieldId('url')}
              label={t('form.url')}
              hint={t('form.urlHint')}
              error={errorText(errors.url?.message)}
            >
              <Input
                autoComplete="off"
                spellCheck={false}
                inputMode="url"
                maxLength={500}
                placeholder="/products"
                className="font-mono"
                {...register('url')}
              />
            </FormField>
          )}
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Heading headingLevel="h2" variant="card">
              {t('form.texts')}
            </Heading>
            <Segmented aria-label={t('form.language')} className="w-40">
              {BANNER_LOCALES.map(item => (
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
            {t(
              linkType === 'URL'
                ? 'form.textsHintUrl'
                : 'form.textsHintCollection',
            )}
          </Text>
          {BANNER_LOCALES.map(item => {
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
                  <Input
                    maxLength={150}
                    placeholder={fallbackTitle(item)}
                    {...register(`translations.${item}.title`)}
                  />
                </FormField>
                <FormField
                  id={id('subtitle')}
                  label={t('form.subtitle')}
                  hint={t('form.subtitleHint')}
                  error={errorText(fieldErrors?.subtitle?.message)}
                >
                  <Input
                    maxLength={80}
                    {...register(`translations.${item}.subtitle`)}
                  />
                </FormField>
                <FormField
                  id={id('cta')}
                  label={t('form.ctaLabel')}
                  hint={t('form.ctaLabelHint')}
                  error={errorText(fieldErrors?.ctaLabel?.message)}
                >
                  <Input
                    maxLength={40}
                    placeholder={t(
                      linkType === 'URL'
                        ? 'form.ctaDefaultUrl'
                        : 'form.ctaDefaultCollection',
                    )}
                    {...register(`translations.${item}.ctaLabel`)}
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
            {t('form.image')}
          </Heading>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ImageField
                label={t('form.imageLabel')}
                aspect="16/9"
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.image ? (
            <Text role="alert" size="xs" variant="destructive">
              {errorText(errors.image.message)}
            </Text>
          ) : null}
        </Card>

        <Card>
          <Heading headingLevel="h2" variant="card">
            {t('form.display')}
          </Heading>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id={fieldId('starts-at')} label={t('form.startsAt')}>
              <Input type="datetime-local" {...register('startsAt')} />
            </FormField>
            <FormField
              id={fieldId('ends-at')}
              label={t('form.endsAt')}
              error={errorText(errors.endsAt?.message)}
            >
              <Input type="datetime-local" {...register('endsAt')} />
            </FormField>
          </div>
          <Text size="xs" variant="muted">
            {t('form.scheduleHint', { zone: SCHEDULE_TIME_ZONE })}
          </Text>
        </Card>
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-3 border-t border-border pt-6 xl:col-span-2',
          banner ? 'justify-between' : 'justify-end',
        )}
      >
        {banner ? <DeleteBannerButton id={banner.id} /> : null}
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
              : banner
                ? t('form.save')
                : t('form.create')}
          </Button>
        </div>
      </div>
    </form>
  );
}
