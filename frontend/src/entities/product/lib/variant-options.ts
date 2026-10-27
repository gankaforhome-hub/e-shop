import { type ProductVariantTranslation } from '../model/types';

export type VariantOptionGroup = {
  key: string;
  title: string;
  /** `valueKey` → localized label, in first-seen order. */
  values: Map<string, string>;
  /** `valueKey` → swatch colour, for appearance values that carry one. */
  swatches: Map<string, string>;
};

/** Unique option values per option key across all variants, in first-seen order. */
export function groupVariantOptions(
  variants: readonly ProductVariantTranslation[],
): VariantOptionGroup[] {
  const groups = new Map<string, VariantOptionGroup>();
  for (const variant of variants) {
    for (const opt of variant.options) {
      const group = groups.get(opt.nameKey) ?? {
        key: opt.nameKey,
        title: opt.name || opt.nameKey,
        values: new Map<string, string>(),
        swatches: new Map<string, string>(),
      };
      if (!group.values.has(opt.valueKey)) {
        group.values.set(opt.valueKey, opt.value || opt.valueKey);
      }
      if (opt.swatch && !group.swatches.has(opt.valueKey)) {
        group.swatches.set(opt.valueKey, opt.swatch);
      }
      groups.set(opt.nameKey, group);
    }
  }
  return [...groups.values()];
}

/**
 * Only axes with a real choice become selectors; a single-value axis (every
 * variant shares it) is a static specification instead.
 */
export const isSelectableGroup = (group: VariantOptionGroup): boolean =>
  group.values.size > 1;

/** Sellable now: in stock, or open for pre-order. */
export const isVariantPurchasable = (
  variant: Pick<ProductVariantTranslation, 'stock'>,
): boolean =>
  variant.stock.quantity > 0 || variant.stock.status === 'pre_order';

/** Appearance axes: colour swatches on the PDP, one catalog card per value. */
export const APPEARANCE_OPTION_KEYS: ReadonlySet<string> = new Set([
  'color',
  'glaze',
]);

const hasOption = (
  variant: ProductVariantTranslation,
  nameKey: string,
  valueKey: string,
) =>
  variant.options.some(o => o.nameKey === nameKey && o.valueKey === valueKey);

/**
 * Variant to open for `nameKey=valueKey`: the one that keeps most of
 * `base`'s other options (same size in another colour), purchasable first.
 */
export function findVariantForOption(
  variants: readonly ProductVariantTranslation[],
  nameKey: string,
  valueKey: string,
  base?: ProductVariantTranslation,
): ProductVariantTranslation | undefined {
  const score = (variant: ProductVariantTranslation) =>
    (base?.options ?? []).filter(
      o => o.nameKey !== nameKey && hasOption(variant, o.nameKey, o.valueKey),
    ).length *
      2 +
    (isVariantPurchasable(variant) ? 1 : 0);

  let best: ProductVariantTranslation | undefined;
  for (const variant of variants) {
    if (
      hasOption(variant, nameKey, valueKey) &&
      (!best || score(variant) > score(best))
    ) {
      best = variant;
    }
  }
  return best;
}

/** Variants of one colour/glaze: one catalog card (see `getAppearanceSlices`). */
export type AppearanceSlice = {
  /** Colour/glaze label; absent when the product has no appearance choice. */
  label?: string;
  variants: ProductVariantTranslation[];
};

/**
 * Splits a product's SKUs by its selectable appearance axis (colour/glaze),
 * in first-seen order: each slice is a separate catalog card, sizes stay
 * inside the slice (chosen on the PDP). No appearance choice → one slice.
 */
export function getAppearanceSlices(
  variants: readonly ProductVariantTranslation[],
): AppearanceSlice[] {
  const axis = groupVariantOptions(variants)
    .filter(isSelectableGroup)
    .find(group => APPEARANCE_OPTION_KEYS.has(group.key));
  if (!axis) {
    return [{ variants: [...variants] }];
  }

  const slices = new Map<string, AppearanceSlice>();
  for (const variant of variants) {
    const valueKey =
      variant.options.find(o => o.nameKey === axis.key)?.valueKey ?? '';
    const label = axis.values.get(valueKey);
    const slice = slices.get(valueKey) ?? {
      ...(label && { label }),
      variants: [],
    };
    slice.variants.push(variant);
    slices.set(valueKey, slice);
  }
  return [...slices.values()];
}

/**
 * SKUs of `variant`'s colour/glaze (its catalog card). The PDP is a page of
 * one colour: selectors and specifications work inside this slice.
 */
export function getVariantSlice(
  variants: readonly ProductVariantTranslation[],
  variant: Pick<ProductVariantTranslation, 'id'> | undefined,
): ProductVariantTranslation[] {
  const slices = getAppearanceSlices(variants);
  return (
    slices.find(slice => slice.variants.some(v => v.id === variant?.id))
      ?.variants ?? [...variants]
  );
}
