import { type Locale } from '@/shared/i18n/routing';

/**
 * Slug of a season entity (`seasons.slug`, e.g. `'christmas'`). Deliberately a
 * plain string: a CMS can create new seasons without code or type changes.
 */
export type SeasonSlug = string;

/** Language-agnostic season core (future `seasons` table). */
export type Season = {
  slug: SeasonSlug;
  /** Display order in filters (calendar order for the mock data). */
  sortOrder: number;
};

/** Row of the future `season_translations` table. */
export type SeasonTranslation = {
  seasonSlug: SeasonSlug;
  languageCode: Locale;
  label: string;
};

/** Season resolved for one locale. */
export type SeasonDTO = Season & {
  label: string;
};
