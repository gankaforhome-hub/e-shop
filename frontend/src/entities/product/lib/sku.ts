export type BuildSkuParams = {
  /** Category code, e.g. `PL` for plates. */
  categoryPrefix: string;
  /** Optional collection code, e.g. `ND`. Placed before the category code. */
  collectionPrefix?: string;
  /** Positive integer sequence of the product inside its prefix group. */
  sequence: number;
  /** Variant option codes, e.g. `['22']` for a 22 cm diameter. */
  optionCodes?: readonly string[];
  /** Minimum digits of the sequence segment (default 2 → `01`). */
  sequencePad?: number;
};

const normalizeSegment = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');

/**
 * Builds a deterministic, CMS-reusable SKU:
 * `<COLLECTION><CATEGORY>-<SEQUENCE>[-<OPTION>...]`, e.g. `NDP-01-22`.
 * Pure function: identical input always yields the identical SKU.
 */
export function buildSku({
  categoryPrefix,
  collectionPrefix = '',
  sequence,
  optionCodes = [],
  sequencePad = 2,
}: BuildSkuParams): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new RangeError(
      `SKU sequence must be a positive integer: ${sequence}`,
    );
  }

  const prefix =
    normalizeSegment(collectionPrefix) + normalizeSegment(categoryPrefix);
  if (!prefix) {
    throw new Error('SKU requires a non-empty category or collection prefix');
  }

  const segments = [
    prefix,
    String(sequence).padStart(sequencePad, '0'),
    ...optionCodes.map(normalizeSegment).filter(Boolean),
  ];

  return segments.join('-');
}
