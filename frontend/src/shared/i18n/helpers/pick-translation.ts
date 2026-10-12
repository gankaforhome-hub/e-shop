import { defaultLocale, type Locale } from '../routing';

/**
 * Picks the translation for `lang` from one entity's translation rows,
 * falling back to the default locale and then to the first available row.
 */
export function pickTranslation<T extends { languageCode: Locale }>(
  translations: readonly T[],
  lang: Locale,
): T | undefined {
  return (
    translations.find(t => t.languageCode === lang) ??
    translations.find(t => t.languageCode === defaultLocale) ??
    translations[0]
  );
}

/** Groups translation rows by the owning entity id for O(1) lookups. */
export function groupTranslationsBy<T>(
  rows: readonly T[],
  getId: (row: T) => string,
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const id = getId(row);
    const group = groups.get(id);
    if (group) {
      group.push(row);
    } else {
      groups.set(id, [row]);
    }
  }
  return groups;
}
