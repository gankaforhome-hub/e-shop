'use server';

import { z } from 'zod';

import { type Media } from '@/entities/media';
import { apiRequest } from '@/shared/api/api-client';

import { MEDIA_ALT_MAX_LENGTH, type MediaErrorKey } from '../model/media-error';

export type MediaActionResult =
  { ok: true; media: Media } | { ok: false; error: MediaErrorKey };

const STATUS_ERRORS: Partial<Record<number, MediaErrorKey>> = {
  400: 'invalidFile',
  401: 'forbidden',
  403: 'forbidden',
  413: 'tooLarge',
  415: 'unsupportedType',
  429: 'tooManyRequests',
};

const toFailure = (status: number): MediaActionResult => ({
  ok: false,
  error: STATUS_ERRORS[status] ?? 'serverError',
});

/** Uploads one image (`file`, optional `alt`). The same file again returns the existing media. */
export async function uploadMediaAction(
  formData: FormData,
): Promise<MediaActionResult> {
  const file = formData.get('file');
  const alt = formData.get('alt');

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'invalidFile' };
  }

  const body = new FormData();
  body.append('file', file, file.name);
  if (typeof alt === 'string' && alt) {
    body.append('alt', alt);
  }

  const result = await apiRequest<Media>('/admin/media', {
    method: 'POST',
    formData: body,
  });

  return result.ok
    ? { ok: true, media: result.data }
    : toFailure(result.status);
}

const updateMediaSchema = z.object({
  id: z.string().uuid(),
  alt: z.string().max(MEDIA_ALT_MAX_LENGTH).nullable().optional(),
  focalX: z.number().min(0).max(1).optional(),
  focalY: z.number().min(0).max(1).optional(),
});

export type UpdateMediaActionInput = z.input<typeof updateMediaSchema>;

/** Changes the alt text and/or the focal point of an uploaded image. */
export async function updateMediaAction(
  input: UpdateMediaActionInput,
): Promise<MediaActionResult> {
  const parsed = updateMediaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalidFile' };
  }

  const { id, ...changes } = parsed.data;
  const result = await apiRequest<Media>(`/admin/media/${id}`, {
    method: 'PATCH',
    json: changes,
  });

  return result.ok
    ? { ok: true, media: result.data }
    : toFailure(result.status);
}
