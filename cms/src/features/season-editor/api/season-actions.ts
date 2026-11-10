'use server';

import { type AdminSeason } from '@/entities/collection';
import { apiRequest } from '@/shared/api/api-client';

import {
  seasonFormSchema,
  type SeasonErrorKey,
  type SeasonFormInput,
  type SeasonFormValues,
} from '../model/season.schema';

export type SeasonActionResult =
  | { ok: true; season: AdminSeason }
  | { ok: false; error: SeasonErrorKey; field?: 'slug' };

type Failure = Extract<SeasonActionResult, { ok: false }>;

function toFailure(status: number): Failure {
  if (status === 409) {
    return { ok: false, error: 'slugTaken', field: 'slug' };
  }
  const byStatus: Partial<Record<number, SeasonErrorKey>> = {
    401: 'forbidden',
    403: 'forbidden',
    404: 'notFound',
    429: 'tooManyRequests',
  };
  return { ok: false, error: byStatus[status] ?? 'serverError' };
}

// An empty English label is left out: the API keeps or lacks it, the storefront falls back to uk
const toTranslations = ({ labels }: SeasonFormValues) => [
  { languageCode: 'uk', label: labels.uk },
  ...(labels.en ? [{ languageCode: 'en', label: labels.en }] : []),
];

export async function createSeasonAction(
  input: SeasonFormInput,
): Promise<SeasonActionResult> {
  const parsed = seasonFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'serverError' };
  }

  const result = await apiRequest<AdminSeason>('/admin/seasons', {
    method: 'POST',
    json: {
      slug: parsed.data.slug,
      sortOrder: parsed.data.sortOrder,
      translations: toTranslations(parsed.data),
    },
  });

  return result.ok
    ? { ok: true, season: result.data }
    : toFailure(result.status);
}

/** Labels and position only: the slug is the key collections refer to. */
export async function updateSeasonAction(
  slug: string,
  input: SeasonFormInput,
): Promise<SeasonActionResult> {
  const parsed = seasonFormSchema.safeParse({ ...input, slug });
  if (!parsed.success) {
    return { ok: false, error: 'serverError' };
  }

  const result = await apiRequest<AdminSeason>(
    `/admin/seasons/${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      json: {
        sortOrder: parsed.data.sortOrder,
        translations: toTranslations(parsed.data),
      },
    },
  );

  return result.ok
    ? { ok: true, season: result.data }
    : toFailure(result.status);
}

/** Deletes an unused season; the API answers 409 while collections use it. */
export async function deleteSeasonAction(
  slug: string,
): Promise<{ ok: true } | Failure> {
  const result = await apiRequest<void>(
    `/admin/seasons/${encodeURIComponent(slug)}`,
    { method: 'DELETE' },
  );
  if (result.ok || result.status === 404) {
    return { ok: true };
  }
  return result.status === 409
    ? { ok: false, error: 'inUse' }
    : toFailure(result.status);
}
