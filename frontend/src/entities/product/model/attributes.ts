/* ------------------------------------------------------------------ */
/* Ceramics domain matrix — language-agnostic attribute keys (CMS ⇄ UI)*/
/* Each `as const` tuple is the single source of truth for its union,  */
/* the URL filter guards and the dictionary completeness check.        */
/* ------------------------------------------------------------------ */

export const PRODUCT_MATERIALS = [
  'porcelain',
  'ceramic',
  'glass',
  'soy_wax',
] as const;
export const COLOR_DECORATIONS = [
  'coloured',
  'hand_painted',
  'gold_platinum_trim',
  'white',
] as const;

export const PLATE_TYPES_1 = ['flat', 'rimmed'] as const;
export const PLATE_TYPES_2 = [
  'bread',
  'dessert',
  'dinner',
  'soup',
  'serving',
] as const;
export const PLATE_SHAPES = [
  'round',
  'oval',
  'conical',
  'cylindrical',
] as const;
export const PLATE_DIAMETERS_CM = [15, 18, 23, 25, 27, 28, 31] as const;

export const VOLUMES_ML = [150, 250, 300, 380, 400, 500, 800, 1000] as const;
export const CUP_TYPES = ['teacup', 'coffee', 'espresso'] as const;
export const SERVES_COUNTS = [2, 4, 5, 6, 12] as const;

export const BURN_TIMES_HOURS = [35, 50, 75] as const;
export const CANDLE_SCENTS = ['unscented', 'scented'] as const;
export const WAX_TYPES = ['soy'] as const;
export const VESSEL_MATERIALS = ['porcelain', 'ceramic', 'glass'] as const;

export const SET_TYPES = ['tea', 'coffee', 'dinner', 'combination'] as const;
export const SET_CONTENTS = [
  'cups',
  'saucers',
  'plates',
  'teapot',
  'jug',
] as const;

export type ProductMaterial = (typeof PRODUCT_MATERIALS)[number];
export type ColorDecoration = (typeof COLOR_DECORATIONS)[number];
export type PlateType1 = (typeof PLATE_TYPES_1)[number];
export type PlateType2 = (typeof PLATE_TYPES_2)[number];
export type PlateShape = (typeof PLATE_SHAPES)[number];
export type PlateDiameterCm = (typeof PLATE_DIAMETERS_CM)[number];
export type VolumeMl = (typeof VOLUMES_ML)[number];
export type CupType = (typeof CUP_TYPES)[number];
export type ServesCount = (typeof SERVES_COUNTS)[number];
export type BurnTimeHours = (typeof BURN_TIMES_HOURS)[number];
export type CandleScent = (typeof CANDLE_SCENTS)[number];
export type WaxType = (typeof WAX_TYPES)[number];
export type VesselMaterial = (typeof VESSEL_MATERIALS)[number];
export type SetType = (typeof SET_TYPES)[number];
export type SetContent = (typeof SET_CONTENTS)[number];

/**
 * Canonical typed attributes of a sellable item; every field is optional per
 * category. Split by level: price/size determinants live on the variant (SKU),
 * everything else on the parent product (see `VARIANT_ATTRIBUTE_KEYS`).
 */
export type ProductAttributes = {
  // Shared / general
  glazeType?: string;
  material?: ProductMaterial;
  colorDecoration?: ColorDecoration;
  isDishwasherSafe?: boolean;
  isMicrowaveSafe?: boolean;
  // Plates
  plateType1?: PlateType1;
  plateType2?: PlateType2;
  shape?: PlateShape;
  diameterCm?: PlateDiameterCm;
  // Cups, kettles, glasses
  volumeMl?: VolumeMl;
  cupType?: CupType;
  hasSaucer?: boolean;
  servesCount?: ServesCount;
  // Candles
  burnTimeHours?: BurnTimeHours;
  scent?: CandleScent;
  waxType?: WaxType;
  vesselMaterial?: VesselMaterial;
  heightCm?: number;
  // Sets
  setType?: SetType;
  setContents?: SetContent[];
  piecesCount?: number;
};

/**
 * Attributes that determine a variant's price and physical size/scent. They
 * are stored only on `ProductVariant.attributes` and become its selectable
 * options (size chips, volume pills) in the card and on the product page.
 */
export const VARIANT_ATTRIBUTE_KEYS = [
  'diameterCm',
  'volumeMl',
  'servesCount',
  'burnTimeHours',
  'heightCm',
  'piecesCount',
  'scent',
] as const satisfies readonly (keyof ProductAttributes)[];

export type VariantAttributeKey = (typeof VARIANT_ATTRIBUTE_KEYS)[number];

/** SKU-level attributes (price/size determinants). */
export type VariantAttributes = Pick<ProductAttributes, VariantAttributeKey>;

/** Parent-level attributes shared by every variant (material, glaze, safety…). */
export type ProductBaseAttributes = Omit<
  ProductAttributes,
  VariantAttributeKey
>;

const VARIANT_ATTRIBUTE_KEY_SET: ReadonlySet<string> = new Set(
  VARIANT_ATTRIBUTE_KEYS,
);

export const isVariantAttributeKey = (
  key: keyof ProductAttributes,
): key is VariantAttributeKey => VARIANT_ATTRIBUTE_KEY_SET.has(key);

/** Filterable enum attributes → allowed values (drives facets, URL guards, i18n). */
export const PRODUCT_ATTRIBUTE_OPTIONS = {
  material: PRODUCT_MATERIALS,
  colorDecoration: COLOR_DECORATIONS,
  plateType1: PLATE_TYPES_1,
  plateType2: PLATE_TYPES_2,
  shape: PLATE_SHAPES,
  diameterCm: PLATE_DIAMETERS_CM,
  volumeMl: VOLUMES_ML,
  cupType: CUP_TYPES,
  servesCount: SERVES_COUNTS,
  burnTimeHours: BURN_TIMES_HOURS,
  scent: CANDLE_SCENTS,
  waxType: WAX_TYPES,
  vesselMaterial: VESSEL_MATERIALS,
  setType: SET_TYPES,
  setContents: SET_CONTENTS,
} as const satisfies Partial<
  Record<keyof ProductAttributes, readonly unknown[]>
>;

export type ProductAttributeFilterKey = keyof typeof PRODUCT_ATTRIBUTE_OPTIONS;

export type ProductAttributeOption<K extends ProductAttributeFilterKey> =
  (typeof PRODUCT_ATTRIBUTE_OPTIONS)[K][number];

/** Filter keys whose values are numbers (labels use a unit template). */
export type NumericAttributeFilterKey = {
  [K in ProductAttributeFilterKey]: ProductAttributeOption<K> extends number
    ? K
    : never;
}[ProductAttributeFilterKey];

/** Filter keys whose values are string slugs (labels come from the dictionary). */
export type EnumAttributeFilterKey = Exclude<
  ProductAttributeFilterKey,
  NumericAttributeFilterKey
>;

/** Numeric variant attributes (labels use a unit template). */
export type NumericVariantAttributeKey = Exclude<VariantAttributeKey, 'scent'>;

export const PRODUCT_ATTRIBUTE_FILTER_KEYS = [
  'material',
  'colorDecoration',
  'plateType1',
  'plateType2',
  'shape',
  'diameterCm',
  'volumeMl',
  'cupType',
  'servesCount',
  'burnTimeHours',
  'scent',
  'waxType',
  'vesselMaterial',
  'setType',
  'setContents',
] as const satisfies readonly ProductAttributeFilterKey[];

/** Boolean parent attributes exposed as one "Features" checkbox group. */
export const PRODUCT_FEATURE_FLAGS = [
  'isDishwasherSafe',
  'isMicrowaveSafe',
  'hasSaucer',
] as const satisfies readonly (keyof ProductBaseAttributes)[];

export type ProductFeatureFlag = (typeof PRODUCT_FEATURE_FLAGS)[number];
