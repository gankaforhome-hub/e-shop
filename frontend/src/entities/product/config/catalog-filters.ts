import { type CategorySlug } from '@/shared/config/routes';

import {
  type ProductFeatureFlag,
  type ProductAttributeFilterKey,
} from '../model/attributes';

/** Products per catalog page (one "Load more" batch). */
export const CATALOG_PAGE_SIZE = 12;

/** Price buckets (UAH) shown as checkboxes; `max` is exclusive. */
export const PRICE_RANGES = [
  'under_1000',
  '1000_2500',
  '2500_5000',
  'over_5000',
] as const;

export type PriceRange = (typeof PRICE_RANGES)[number];

export const PRICE_RANGE_BOUNDS = {
  under_1000: { min: 0, max: 1000 },
  '1000_2500': { min: 1000, max: 2500 },
  '2500_5000': { min: 2500, max: 5000 },
  over_5000: { min: 5000, max: Number.POSITIVE_INFINITY },
} as const satisfies Record<PriceRange, { min: number; max: number }>;

/** Attribute groups shown when no category is selected. */
export const DEFAULT_ATTRIBUTE_FILTERS = [
  'material',
  'colorDecoration',
] as const satisfies readonly ProductAttributeFilterKey[];

/** Category-specific attribute groups, in display order (category first, shared after). */
export const CATEGORY_ATTRIBUTE_FILTERS = {
  plates: [
    'plateType1',
    'plateType2',
    'diameterCm',
    'shape',
    'material',
    'colorDecoration',
  ],
  cups: ['cupType', 'volumeMl', 'material', 'colorDecoration'],
  kettles: ['volumeMl', 'servesCount', 'material', 'colorDecoration'],
  glass: ['volumeMl', 'material', 'colorDecoration'],
  candlesticks: ['burnTimeHours', 'scent', 'waxType', 'vesselMaterial'],
  sets: [
    'setType',
    'setContents',
    'servesCount',
    'material',
    'colorDecoration',
  ],
} as const satisfies Record<CategorySlug, readonly ProductAttributeFilterKey[]>;

export const DEFAULT_FEATURE_FLAGS = [
  'isDishwasherSafe',
  'isMicrowaveSafe',
] as const satisfies readonly ProductFeatureFlag[];

export const CATEGORY_FEATURE_FLAGS = {
  plates: ['isDishwasherSafe', 'isMicrowaveSafe'],
  cups: ['hasSaucer', 'isDishwasherSafe', 'isMicrowaveSafe'],
  kettles: ['isDishwasherSafe'],
  glass: ['isDishwasherSafe'],
  candlesticks: [],
  sets: ['isDishwasherSafe', 'isMicrowaveSafe'],
} as const satisfies Record<CategorySlug, readonly ProductFeatureFlag[]>;

export function getAttributeFiltersFor(
  category: CategorySlug | undefined,
): readonly ProductAttributeFilterKey[] {
  return category
    ? CATEGORY_ATTRIBUTE_FILTERS[category]
    : DEFAULT_ATTRIBUTE_FILTERS;
}

export function getFeatureFlagsFor(
  category: CategorySlug | undefined,
): readonly ProductFeatureFlag[] {
  return category ? CATEGORY_FEATURE_FLAGS[category] : DEFAULT_FEATURE_FLAGS;
}
