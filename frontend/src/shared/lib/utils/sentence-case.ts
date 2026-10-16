/**
 * Sentence case: first letter upper-case, everything else lower-case
 * ("Тарілка Керамічна Обідня" → "Тарілка керамічна обідня"). Locale-aware,
 * so pass the UI locale when it is known.
 */
export function toSentenceCase(text: string, locale?: string): string {
  const lower = text.trim().toLocaleLowerCase(locale);
  return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1);
}
