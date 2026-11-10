'use client';

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';

import { useTranslations } from 'next-intl';

import { type Media } from '@/entities/media';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import {
  updateMediaAction,
  uploadMediaAction,
  type MediaActionResult,
  type UpdateMediaActionInput,
} from '../api/media-actions';
import { compressImage } from '../lib/compress-image';
import {
  MAX_UPLOAD_BYTES,
  MEDIA_ALT_MAX_LENGTH,
  type MediaErrorKey,
} from '../model/media-error';

/** Shapes the storefront crops the image to (card cover, home hero). */
export type MediaFieldAspect = '570/585' | '16/9';

interface MediaFieldProps {
  label: string;
  /** The uploaded image, or `null` when none is chosen. The form keeps `value.id`. */
  value: Media | null;
  onChange: (media: Media | null) => void;
  aspect: MediaFieldAspect;
  disabled?: boolean;
}

// Tallest focal picker, so a portrait photo doesn't push the form off the screen
const FOCAL_PICKER_MAX_HEIGHT_REM = 18;

const clampFraction = (fraction: number) =>
  Math.round(Math.min(1, Math.max(0, fraction)) * 100) / 100;

export function MediaField({
  label,
  value,
  onChange,
  aspect,
  disabled = false,
}: MediaFieldProps) {
  const t = useTranslations('media');
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<'uploading' | 'saving' | null>(null);
  const [error, setError] = useState<MediaErrorKey | null>(null);

  const isLocked = disabled || busy !== null;

  const finish = (result: MediaActionResult) => {
    if (result.ok) {
      onChange(result.media);
    } else {
      setError(result.error);
    }
  };

  const upload = async (file: File) => {
    setError(null);
    setBusy('uploading');
    try {
      const prepared = await compressImage(file);
      if (prepared.size > MAX_UPLOAD_BYTES) {
        setError('tooLarge');
        return;
      }

      const formData = new FormData();
      formData.append('file', prepared);
      // A replacement keeps the text of the image it replaces
      if (value?.alt) {
        formData.append('alt', value.alt);
      }
      finish(await uploadMediaAction(formData));
    } catch {
      setError('serverError');
    } finally {
      setBusy(null);
    }
  };

  const save = async (changes: Omit<UpdateMediaActionInput, 'id'>) => {
    if (!value) {
      return;
    }
    setError(null);
    setBusy('saving');
    try {
      finish(await updateMediaAction({ id: value.id, ...changes }));
    } catch {
      setError('serverError');
    } finally {
      setBusy(null);
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Lets the same file be chosen again after an error
    event.target.value = '';
    if (file) {
      void upload(file);
    }
  };

  const pickFocalPoint = (event: MouseEvent<HTMLDivElement>) => {
    if (isLocked) {
      return;
    }
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    void save({
      focalX: clampFraction((event.clientX - left) / width),
      focalY: clampFraction((event.clientY - top) / height),
    });
  };

  const largest = value?.variants.at(-1);
  const srcSet = value?.variants
    .map(variant => `${variant.publicUrl} ${variant.width}w`)
    .join(', ');

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="flex flex-col gap-3"
    >
      <Text as="span" id={`${id}-label`} size="sm" weight="medium">
        {label}
      </Text>

      <div
        role="img"
        aria-label={t('field.previewLabel')}
        style={{ aspectRatio: aspect.replace('/', ' / ') }}
        className="relative w-full max-w-sm overflow-hidden rounded-md border border-border bg-muted"
      >
        {value && largest ? (
          // Storage files are served as they are: the CMS has no image optimizer
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={largest.publicUrl}
            srcSet={srcSet}
            sizes="24rem"
            alt={value.alt ?? ''}
            style={{ objectPosition: value.objectPosition }}
            className="size-full object-cover"
          />
        ) : (
          <Text
            size="sm"
            variant="muted"
            className="absolute inset-0 flex items-center justify-center"
          >
            {t('field.empty')}
          </Text>
        )}
      </div>
      <Text size="xs" variant="muted">
        {t('field.aspectHint', { ratio: aspect.replace('/', ':') })}
      </Text>

      <input
        ref={fileInput}
        type="file"
        // Any image: an SVG or GIF reaches the API, which answers with a clear error
        accept="image/*"
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
        onChange={handleFile}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={isLocked} onClick={() => fileInput.current?.click()}>
          {value ? t('field.replace') : t('field.upload')}
        </Button>
        {value ? (
          <Button
            variant="ghost"
            disabled={isLocked}
            onClick={() => onChange(null)}
          >
            {t('field.remove')}
          </Button>
        ) : null}
        {busy ? (
          <Text role="status" size="xs" variant="muted">
            {t(busy === 'uploading' ? 'field.uploading' : 'field.saving')}
          </Text>
        ) : null}
      </div>
      {error ? (
        <Text role="alert" size="sm" variant="destructive">
          {t(`errors.${error}`)}
        </Text>
      ) : null}

      {value && largest ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Text as="span" size="sm" weight="medium">
              {t('field.focalPoint')}
            </Text>
            <div
              onClick={pickFocalPoint}
              style={{
                aspectRatio: `${value.width} / ${value.height}`,
                maxWidth: `${(FOCAL_PICKER_MAX_HEIGHT_REM * value.width) / value.height}rem`,
              }}
              className="relative w-full cursor-crosshair overflow-hidden rounded-md border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={largest.publicUrl}
                alt=""
                className="pointer-events-none size-full select-none"
              />
              <span
                aria-hidden="true"
                style={{
                  left: `${value.focalX * 100}%`,
                  top: `${value.focalY * 100}%`,
                }}
                className="border-white pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary shadow-sm"
              />
            </div>
            <Text size="xs" variant="muted">
              {t('field.focalHint')}
            </Text>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-alt`}>{t('field.alt')}</Label>
            <Input
              id={`${id}-alt`}
              // Remounts with the saved text after the API answers
              key={`${value.id}:${value.alt ?? ''}`}
              defaultValue={value.alt ?? ''}
              maxLength={MEDIA_ALT_MAX_LENGTH}
              disabled={isLocked}
              aria-describedby={`${id}-alt-hint`}
              onBlur={event => {
                const next = event.target.value.trim();
                if (next !== (value.alt ?? '')) {
                  void save({ alt: next || null });
                }
              }}
            />
            <Text id={`${id}-alt-hint`} size="xs" variant="muted">
              {t('field.altHint')}
            </Text>
          </div>
        </>
      ) : null}
    </div>
  );
}
