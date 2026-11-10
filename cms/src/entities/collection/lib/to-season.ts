import { type AdminSeason, type Season } from '../model/types';

/** An admin season as a select option: label in `locale`, else uk, else the slug. */
export function toSeason(
  { slug, sortOrder, translations }: AdminSeason,
  locale: string,
): Season {
  const label =
    translations.find(item => item.languageCode === locale)?.label ??
    translations.find(item => item.languageCode === 'uk')?.label ??
    slug;

  return { slug, label, sortOrder };
}
