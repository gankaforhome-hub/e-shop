/**
 * `[0, 1, …, times - 1]` for rendering placeholder lists. Negative, fractional
 * or non-finite counts (e.g. a computed "remaining items" of -2 or NaN) are
 * clamped instead of throwing `RangeError: Invalid array length`.
 */
export const repeat = (times: number): number[] => {
  const length = Number.isFinite(times) ? Math.max(0, Math.floor(times)) : 0;
  return Array.from({ length }, (_, index) => index);
};
