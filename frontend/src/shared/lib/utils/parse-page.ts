/**
 * Positive integer page from a raw `?page=` value (first one if repeated);
 * anything else (missing, `0`, `2.5`, `abc`) → 1.
 */
export function parsePage(raw: string | string[] | undefined): number {
  const page = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isSafeInteger(page) && page > 1 ? page : 1;
}
