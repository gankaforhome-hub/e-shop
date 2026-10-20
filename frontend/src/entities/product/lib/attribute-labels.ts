import { type CommonDict } from '@/shared/i18n/types';

import { type CatalogFilterParam } from './catalog-query';
import { type AttributeLabels } from '../model/attribute-translations';
import {
  type NumericAttributeFilterKey,
  type NumericVariantAttributeKey,
  type VariantAttributeKey,
  type VariantAttributes,
} from '../model/attributes';

/** Attribute keys rendered with a localized unit template. */
export type NumericAttributeKey =
  NumericAttributeFilterKey | NumericVariantAttributeKey;

/** Filter groups whose heading is UI wording, not an attribute name. */
type UiFilterParam = Extract<
  CatalogFilterParam,
  'collection' | 'season' | 'features'
>;

/** Headings from the UI dictionary; the price range is a control, not a facet param. */
export type UiFilterGroup = UiFilterParam | 'price';

/**
 * UI strings the catalog takes from the `common.catalog` dictionary. Domain
 * vocabulary lives in translation tables: attribute names and values
 * (`getAttributeLabels`), seasons (`getSeasons`, collection slice). The type fails `check-types` if a UI group heading
 * or unit template lacks a translation.
 */
type CompleteCatalogDict = {
  groups: Record<UiFilterGroup, string>;
  units: Record<NumericAttributeKey, string>;
};

export type CatalogDict = CommonDict['catalog'] & CompleteCatalogDict;

/** Formats a numeric attribute with its localized unit template (ICU, via next-intl). */
export type FormatAttributeUnit = (
  key: NumericAttributeKey,
  value: number,
) => string;

const NUMERIC_FILTER_KEYS = [
  'diameterCm',
  'volumeMl',
  'servesCount',
  'burnTimeHours',
] as const satisfies readonly NumericAttributeFilterKey[];

const isNumericFilterKey = (
  key: CatalogFilterParam,
): key is NumericAttributeFilterKey =>
  (NUMERIC_FILTER_KEYS as readonly string[]).includes(key);

export const isUiFilterGroup = (
  param: CatalogFilterParam,
): param is UiFilterParam =>
  param === 'collection' || param === 'season' || param === 'features';

/**
 * Label for values the translation tables don't carry: numeric attributes
 * (unit template). Anything else falls back to the raw key, so unexpected CMS
 * data never breaks the UI.
 */
export function formatFilterOptionLabel(
  dict: CatalogDict,
  formatUnit: FormatAttributeUnit,
  param: CatalogFilterParam,
  value: string,
): string {
  if (isNumericFilterKey(param)) {
    const amount = Number(value);
    return Number.isFinite(amount) ? formatUnit(param, amount) : value;
  }
  return value;
}

/** Localized `{ name, value }` of one variant attribute (option chips, cart line). */
export type DescribeVariantAttribute = (
  key: VariantAttributeKey,
  value: NonNullable<VariantAttributes[VariantAttributeKey]>,
) => { name: string; value: string };

/** Names and enum values from the translation tables; numbers via unit templates. */
export function createVariantAttributeDescriber(
  labels: AttributeLabels,
  formatUnit: FormatAttributeUnit,
): DescribeVariantAttribute {
  return (key, value) => {
    const name = labels.names[key] ?? key;
    if (key === 'scent' || typeof value !== 'number') {
      const raw = String(value);
      return { name, value: labels.values[key]?.[raw] ?? raw };
    }
    return { name, value: formatUnit(key, value) };
  };
}
