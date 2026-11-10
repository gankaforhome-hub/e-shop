'use server';

import { getLocale } from 'next-intl/server';

import { type AdminCollection } from '@/entities/collection';
import { apiRequest } from '@/shared/api/api-client';
import { routes } from '@/shared/config';
import { redirect } from '@/shared/i18n/navigation';

import {
  COLLECTION_LOCALES,
  collectionInputSchema,
  isTranslationEmpty,
  type CollectionErrorKey,
  type CollectionInput,
} from '../model/collection.schema';

/** Fields a server answer can point at; everything else is a form-level error. */
export type CollectionErrorField = 'slug' | 'seasonSlug';

export type CollectionActionResult =
  | { ok: true; collection: AdminCollection }
  | {
      ok: false;
      formError?: CollectionErrorKey;
      fieldErrors?: Partial<Record<CollectionErrorField, CollectionErrorKey>>;
    };

type Failure = Extract<CollectionActionResult, { ok: false }>;

/**
 * API errors → form errors. The backend names the field in its message:
 * 409 "slug is already taken" / "No free collection SKU prefix …" / "The collection is used
 * by N banner(s)", 400 "seasonSlug: …" and "coverImageId: …".
 */
function toFailure(status: number, message = ''): Failure {
  if (status === 409) {
    if (message.startsWith('No free collection SKU prefix')) {
      return { ok: false, formError: 'skuPrefixExhausted' };
    }
    if (message.startsWith('The collection is used by')) {
      return { ok: false, formError: 'usedInBanners' };
    }
    return { ok: false, fieldErrors: { slug: 'slugTaken' } };
  }
  if (status === 400) {
    if (message.startsWith('seasonSlug')) {
      return { ok: false, fieldErrors: { seasonSlug: 'seasonNotFound' } };
    }
    if (/^coverImageId/.test(message)) {
      return { ok: false, formError: 'mediaNotFound' };
    }
  }
  const byStatus: Partial<Record<number, CollectionErrorKey>> = {
    401: 'forbidden',
    403: 'forbidden',
    404: 'notFound',
    429: 'tooManyRequests',
  };
  return { ok: false, formError: byStatus[status] ?? 'serverError' };
}

/** Form input → `CreateCollectionDto` / `UpdateCollectionDto`. An empty en is left out. */
function toRequestBody({
  translations,
  seasonSlug,
  ...core
}: ReturnType<typeof collectionInputSchema.parse>) {
  return {
    ...core,
    seasonSlug: seasonSlug || null,
    translations: COLLECTION_LOCALES.filter(
      locale => locale === 'uk' || !isTranslationEmpty(translations[locale]),
    ).map(languageCode => {
      const { metaTitle, metaDescription, ...texts } =
        translations[languageCode];
      return {
        languageCode,
        ...texts,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      };
    }),
  };
}

/** Creates a collection and opens its editor. */
export async function createCollectionAction(
  input: CollectionInput,
): Promise<CollectionActionResult> {
  const parsed = collectionInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, formError: 'serverError' };
  }

  const result = await apiRequest<AdminCollection>('/admin/collections', {
    method: 'POST',
    json: toRequestBody(parsed.data),
  });
  if (!result.ok) {
    return toFailure(result.status, result.message);
  }

  return redirect({
    href: routes.catalog.collection(result.data.id),
    locale: await getLocale(),
  });
}

/** Saves the whole form; languages left empty keep their stored text (the API can't delete them). */
export async function updateCollectionAction(
  id: string,
  input: CollectionInput,
): Promise<CollectionActionResult> {
  const parsed = collectionInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, formError: 'serverError' };
  }

  const result = await apiRequest<AdminCollection>(
    `/admin/collections/${encodeURIComponent(id)}`,
    { method: 'PATCH', json: toRequestBody(parsed.data) },
  );

  return result.ok
    ? { ok: true, collection: result.data }
    : toFailure(result.status, result.message);
}

/** Deletes a collection (its images stay in the library) and returns to the list. */
export async function deleteCollectionAction(
  id: string,
): Promise<CollectionActionResult> {
  const result = await apiRequest<void>(
    `/admin/collections/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
  // Already gone counts as done
  if (!result.ok && result.status !== 404) {
    return toFailure(result.status, result.message);
  }

  return redirect({
    href: routes.catalog.collections,
    locale: await getLocale(),
  });
}
