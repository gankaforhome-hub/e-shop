// Apostrophes join a word ("Люм’єр"); any other non-letter/digit separates words
const APOSTROPHES = /['’ʼ`]/g;
const COMBINING_MARKS = /\p{M}+/gu;
const NON_WORD = /[^\p{L}\p{N}]+/gu;

/**
 * Case-, accent- and punctuation-insensitive form of a text for in-memory
 * search: `"Люм’єр, Plate-Set"` → `"люмєр plate set"`.
 */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(APOSTROPHES, '')
    .replace(NON_WORD, ' ')
    .trim();
}

/** Distinct normalized words of a query, in typing order. */
export function toSearchTokens(query: string): string[] {
  return [...new Set(normalizeSearchText(query).split(' ').filter(Boolean))];
}

/** How well a query word matches a text; higher is better, 0 is no match. */
export const SEARCH_MATCH = {
  none: 0,
  /** Inside a word, or an inflected form ("plates" → "plate"). */
  partial: 1,
  /** Start of a word: what search-as-you-type produces. */
  prefix: 2,
  word: 3,
} as const;

export type SearchMatch = (typeof SEARCH_MATCH)[keyof typeof SEARCH_MATCH];

/**
 * Match of one normalized query word against normalized `text`. Dropping the
 * last letter of longer words tolerates plurals and Ukrainian endings
 * ("plates" → "plate", "тарілки" → "тарілка").
 */
export function matchSearchToken(text: string, token: string): SearchMatch {
  if (!text || !token) {
    return SEARCH_MATCH.none;
  }

  const words = text.split(' ');
  if (words.includes(token)) {
    return SEARCH_MATCH.word;
  }
  if (words.some(word => word.startsWith(token))) {
    return SEARCH_MATCH.prefix;
  }
  if (token.length >= 3 && text.includes(token)) {
    return SEARCH_MATCH.partial;
  }

  const stem = token.length >= 4 ? token.slice(0, -1) : '';
  return stem && words.some(word => word.startsWith(stem))
    ? SEARCH_MATCH.partial
    : SEARCH_MATCH.none;
}
