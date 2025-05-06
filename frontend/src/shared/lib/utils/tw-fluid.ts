/**
 * A list of supported CSS properties for fluid scaling in Tailwind.
 *
 * These correspond to commonly responsive properties like:
 * - width (e.g., "w")
 * - padding (e.g., "p", "px", etc.)
 * - margin (e.g., "m", "mx", etc.)
 * - text (e.g., "text")
 * - gap (e.g., "gap")
 * - inset (e.g., "inset")
 *
 * You can also pass any custom string for unsupported or extended use cases.
 */

type CSSProperty =
  | "padding"
  | "margin"
  | "width"
  | "height"
  | "text"
  | "gap"
  | "inset"
  | string;

type PaddingClass = "p" | "px" | "py" | "pt" | "pr" | "pb" | "pl";
type MarginClass = "m" | "mx" | "my" | "mt" | "mr" | "mb" | "ml";
type WidthClass = "w";
type HeightClass = "h";
type TextClass = "text";
type GapClass = "gap" | "gapr" | "gapc";

type TWClass<P extends CSSProperty> = P extends "padding"
  ? PaddingClass
  : P extends "margin"
    ? MarginClass
    : P extends "width"
      ? WidthClass
      : P extends "height"
        ? HeightClass
        : P extends "text"
          ? TextClass
          : P extends "gap"
            ? GapClass
            : string;

/**
 * Generates a Tailwind utility class string for a given CSS property using fluid (responsive) values
 * via custom CSS properties (e.g., --fluid-width-min, --fluid-width-max).
 *
 * This function is intended to be used with a matching CSS setup that applies `clamp()` using these custom properties.
 *
 * ### Function Output
 * Returns a string like:
 * ```
 * fluid-{property} {twClass}-fluid [--fluid-{property}-min:{min}] [--fluid-{property}-max:{max}]
 * ```
 *
 * ### Example
 * ```ts
 * generateFluidClass("padding", "px", 1, 4);
 * // Returns:
 * // "fluid-padding px-fluid [--fluid-padding-min:1] [--fluid-padding-max:4]"
 * ```
 *
 * ### Type Parameters
 * - `T extends CSSProperty` — a string union type representing supported CSS properties
 *   (e.g. `"width"`, `"padding"`, `"fontSize"`, etc.)
 *
 * ### Parameters
 * @param {T} property — A valid CSS property (from `CSSProperty`) for which the fluid scaling will be applied.
 *                       These should correspond to properties handled by your CSS implementation using `clamp()`.
 *
 * @param {TWClass<T>} twClass — A valid Tailwind utility prefix that maps to the specified `property`.
 *                               For example:
 *                               - If `property` is `"padding"`, then `twClass` could be `"p"`, `"px"`, etc.
 *                               - If `property` is `"width"`, then `twClass` must be `"w"`.
 *                               These classes should exist in your Tailwind CSS and have a modifier
 *                               (like `-fluid`) defined in your custom plugin or stylesheet.
 *
 * @param {number} min — The minimum value for the fluid range (in Tailwind-compatible units, like `rem` or `px`).
 *
 * @param {number} max — The maximum value for the fluid range.
 *
 * @returns {string} A space-separated class string including:
 * - a `fluid-{property}` identifier for targeting styles
 * - a Tailwind utility class with `-fluid` modifier (e.g., `px-fluid`)
 * - two custom CSS properties (`--fluid-{property}-min` and `--fluid-{property}-max`)
 */
// /**
//  * Generates a responsive utility class for a given CSS property using fluid values.
//  *
//  * The returned string includes:
//  * - a `fluid-{property}` class
//  * - a Tailwind class with `-fluid` modifier (e.g. `px-fluid`)
//  * - custom CSS variables: `--fluid-{property}-min` and `--fluid-{property}-max`
//  *
//  * @template T The CSS property type (must extend CSSProperty)
//  * @param property - A supported CSS property, like "padding" or "width"
//  * @param twClass - A matching Tailwind utility class prefix, like "px", "w", "gap"
//  * @param min - Minimum fluid value
//  * @param max - Maximum fluid value
//  * @returns A space-separated class string to use in your markup
//  */
export function twFluid<T extends CSSProperty>(
  property: T,
  twClass: TWClass<T>,
  min: number,
  max: number
): string {
  // Ensure `property` and `twClass` are string types
  if (typeof property !== "string" || typeof twClass !== "string") {
    throw new Error("Property and twClass must be string literals");
  }
  const fluid = `fluid-${property} ${twClass}-fluid [--fluid-${property}-min:${min}] [--fluid-${property}-max:${max}]`;
  return fluid;
}
