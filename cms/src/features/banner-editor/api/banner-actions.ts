'use server';

import { getLocale } from 'next-intl/server';

import { type AdminBanner } from '@/entities/banner';
import { apiRequest } from '@/shared/api/api-client';
import { routes } from '@/shared/config';
import { redirect } from '@/shared/i18n/navigation';

import {
  type BannerErrorKey,
  type BannerInput,
  bannerInputSchema,
} from '../model/banner.schema';

/** Form paths a server answer can point at; everything else is a form-level error. */
export type BannerErrorField =
  'collectionId' | 'url' | 'endsAt' | 'translations.uk.title';

export type BannerActionResult =
  | { ok: true; banner: AdminBanner }
  | {
      ok: false;
      formError?: BannerErrorKey;
      fieldErrors?: Partial<Record<BannerErrorField, BannerErrorKey>>;
    };

type Failure = Extract<BannerActionResult, { ok: false }>;

/** API errors → form errors; the backend names the field at the start of its 400 message. */
function toFailure(status: number, message = ''): Failure {
  if (status === 400) {
    if (message.includes('uk title')) {
      return {
        ok: false,
        fieldErrors: { 'translations.uk.title': 'titleRequired' },
      };
    }
    if (message.startsWith('collectionId: ')) {
      return { ok: false, fieldErrors: { collectionId: 'collectionNotFound' } };
    }
    if (message.startsWith('collectionId')) {
      return { ok: false, fieldErrors: { collectionId: 'collectionRequired' } };
    }
    if (message.startsWith('url')) {
      return { ok: false, fieldErrors: { url: 'invalidUrl' } };
    }
    if (message.startsWith('endsAt')) {
      return { ok: false, fieldErrors: { endsAt: 'invalidSchedule' } };
    }
    if (message.startsWith('imageId')) {
      return { ok: false, formError: 'mediaNotFound' };
    }
  }
  const byStatus: Partial<Record<number, BannerErrorKey>> = {
    401: 'forbidden',
    403: 'forbidden',
    404: 'notFound',
    429: 'tooManyRequests',
  };
  return { ok: false, formError: byStatus[status] ?? 'serverError' };
}

/** Creates a banner (it goes last in the hero) and opens its editor. */
export async function createBannerAction(
  input: BannerInput,
): Promise<BannerActionResult> {
  const parsed = bannerInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, formError: 'serverError' };
  }

  const result = await apiRequest<AdminBanner>('/admin/banners', {
    method: 'POST',
    json: parsed.data,
  });
  if (!result.ok) {
    return toFailure(result.status, result.message);
  }

  return redirect({
    href: routes.content.banner(result.data.id),
    locale: await getLocale(),
  });
}

/** Saves the whole form; both languages are sent, so cleared texts are cleared. */
export async function updateBannerAction(
  id: string,
  input: BannerInput,
): Promise<BannerActionResult> {
  const parsed = bannerInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, formError: 'serverError' };
  }

  const result = await apiRequest<AdminBanner>(
    `/admin/banners/${encodeURIComponent(id)}`,
    { method: 'PATCH', json: parsed.data },
  );

  return result.ok
    ? { ok: true, banner: result.data }
    : toFailure(result.status, result.message);
}

/** Deletes a banner (its image stays in the library) and returns to the list. */
export async function deleteBannerAction(
  id: string,
): Promise<BannerActionResult> {
  const result = await apiRequest<void>(
    `/admin/banners/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
  // Already gone counts as done
  if (!result.ok && result.status !== 404) {
    return toFailure(result.status, result.message);
  }

  return redirect({ href: routes.content.banners, locale: await getLocale() });
}
