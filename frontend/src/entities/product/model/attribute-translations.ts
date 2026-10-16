import { type Locale } from '@/shared/i18n/routing';

/**
 * Row of the future `attribute_translations` table: the localized name of an
 * attribute (filter group heading, product-page option name).
 */
export type AttributeTranslation = {
  attributeKey: string;
  languageCode: Locale;
  name: string;
};

/**
 * Row of the future `attribute_value_translations` table: the localized label
 * of one enum attribute value (e.g. `material` × `porcelain`).
 */
export type AttributeValueTranslation = {
  attributeKey: string;
  valueKey: string;
  languageCode: Locale;
  label: string;
};

/** Attribute vocabulary resolved for one locale (missing rows fall back to the key). */
export type AttributeLabels = {
  /** `attributeKey` → name. */
  names: Readonly<Record<string, string>>;
  /** `attributeKey` → `valueKey` → label. */
  values: Readonly<Record<string, Readonly<Record<string, string>>>>;
};
