import {
  getVariantSlice,
  groupVariantOptions,
  isSelectableGroup,
} from './variant-options';
import { type AttributeLabels } from '../model/attribute-translations';
import { type ProductBaseAttributes } from '../model/attributes';
import {
  type LocalizedProduct,
  type ProductVariantTranslation,
} from '../model/types';

/** One row of the product page "Specifications" list. */
export type ProductSpec = {
  key: string;
  name: string;
  value: string;
};

export type ProductSpecLabels = {
  weight: string;
  yes: string;
  no: string;
};

/** Parent attributes in display order: what it is made of, then what it is. */
const SPEC_ATTRIBUTE_KEYS = [
  'material',
  'glazeType',
  'colorDecoration',
  'plateType1',
  'plateType2',
  'shape',
  'cupType',
  'setType',
  'setContents',
  'waxType',
  'vesselMaterial',
  'isDishwasherSafe',
  'isMicrowaveSafe',
  'hasSaucer',
] as const satisfies readonly (keyof ProductBaseAttributes)[];

/** Free-text characteristic keys that duplicate a typed attribute. */
const CHARACTERISTIC_ALIASES: Readonly<Record<string, string>> = {
  dishwasher: 'isDishwasherSafe',
  microwave: 'isMicrowaveSafe',
  height: 'heightCm',
  pieces: 'piecesCount',
};

/**
 * Static specifications of a product page: typed parent attributes, the
 * selected variant's axes that offer no choice (all variants share them),
 * its weight, then free-text characteristics not already covered. Typed
 * attributes win over a free-text row with the same meaning.
 */
export function getProductSpecs(
  product: Pick<
    LocalizedProduct,
    'attributes' | 'characteristics' | 'variants'
  >,
  variant: ProductVariantTranslation | undefined,
  attributeLabels: AttributeLabels,
  labels: ProductSpecLabels,
): ProductSpec[] {
  const specs: ProductSpec[] = [];

  for (const key of SPEC_ATTRIBUTE_KEYS) {
    const raw = product.attributes[key];
    if (raw === undefined) {
      continue;
    }
    const valueLabel = (value: string) =>
      attributeLabels.values[key]?.[value] ?? value;
    const value =
      typeof raw === 'boolean'
        ? raw
          ? labels.yes
          : labels.no
        : Array.isArray(raw)
          ? raw.map(valueLabel).join(', ')
          : valueLabel(raw);
    specs.push({ key, name: attributeLabels.names[key] ?? key, value });
  }

  const fixedAxes = new Set(
    // Within the page's colour: its colour and any single size are specs
    groupVariantOptions(getVariantSlice(product.variants, variant))
      .filter(group => !isSelectableGroup(group))
      .map(group => group.key),
  );
  for (const opt of variant?.options ?? []) {
    if (!fixedAxes.has(opt.nameKey)) {
      continue;
    }
    // Same heading as a parent attribute (colour vs colour decoration):
    // one row, the variant's own value first ("Forest red · Hand-painted")
    const sameName = specs.find(spec => spec.name === opt.name);
    if (sameName) {
      sameName.value = `${opt.value} · ${sameName.value}`;
    } else {
      specs.push({ key: opt.nameKey, name: opt.name, value: opt.value });
    }
  }

  if (variant?.weight) {
    specs.push({
      key: 'weight',
      name: labels.weight,
      value: variant.weight.label,
    });
  }

  // Selectable axes are shown by the selectors, so they count as covered too
  const covered = new Set([
    ...specs.map(spec => spec.key),
    ...(variant?.options ?? []).map(opt => opt.nameKey),
  ]);
  for (const row of product.characteristics) {
    const key = CHARACTERISTIC_ALIASES[row.nameKey] ?? row.nameKey;
    if (!covered.has(key)) {
      covered.add(key);
      specs.push({ key: row.nameKey, name: row.name, value: row.value });
    }
  }

  return specs;
}
