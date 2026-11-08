/**
 * Slug of a season entity (`seasons.slug`, e.g. `'christmas'`). Deliberately a
 * plain string: a CMS can create new seasons without code or type changes.
 */
export type SeasonSlug = string;

/** Language-agnostic season core (`seasons` table). */
export type Season = {
  slug: SeasonSlug;
  /** Display order in filters. */
  sortOrder: number;
};

/** Season resolved for one locale. */
export type SeasonDTO = Season & {
  label: string;
};
