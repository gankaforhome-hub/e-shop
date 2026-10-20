/** Script order for labels, regardless of the UI locale: Latin, Cyrillic, rest. */
const SCRIPT_RANK = [/^\p{Script=Latin}/u, /^\p{Script=Cyrillic}/u];

const latin = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const cyrillic = new Intl.Collator('uk', {
  sensitivity: 'base',
  numeric: true,
});

const scriptOf = (label: string) => {
  const rank = SCRIPT_RANK.findIndex(pattern => pattern.test(label.trim()));
  return rank === -1 ? SCRIPT_RANK.length : rank;
};

/** Alphabetical with Latin labels before Cyrillic ones ("Glaze" < "Акварель"). */
export function compareLabels(a: string, b: string): number {
  const byScript = scriptOf(a) - scriptOf(b);
  if (byScript !== 0) {
    return byScript;
  }
  return (scriptOf(a) === 1 ? cyrillic : latin).compare(a, b);
}

/** Numeric values (diameter, volume…) keep their ascending data order. */
const isNumeric = (value: string) => value !== '' && Number.isFinite(+value);

/**
 * Options with products first, zero-count ones last (the panel takes this
 * order as a snapshot on open, see `FilterSheet`); inside each tier text
 * options sort by `compareLabels`, numeric ones keep their incoming order.
 */
export function sortOptions<T extends { value: string; label: string }>(
  options: readonly T[],
  countOf: (option: T) => number,
): T[] {
  const byLabel = !options.every(option => isNumeric(option.value));
  return options
    .map((option, index) => ({ option, index }))
    .toSorted(
      (a, b) =>
        Number(countOf(a.option) === 0) - Number(countOf(b.option) === 0) ||
        (byLabel ? compareLabels(a.option.label, b.option.label) : 0) ||
        a.index - b.index,
    )
    .map(({ option }) => option);
}
