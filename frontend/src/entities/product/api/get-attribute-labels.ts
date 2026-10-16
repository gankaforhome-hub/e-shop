import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { groupTranslationsBy, pickTranslation } from '@/shared/i18n/helpers';
import { type Locale } from '@/shared/i18n/routing';

import {
  MOCK_ATTRIBUTE_TRANSLATIONS,
  MOCK_ATTRIBUTE_VALUE_TRANSLATIONS,
} from '../mock/attribute-translations';
import { type AttributeLabels } from '../model/attribute-translations';

/**
 * Attribute vocabulary for `lang`, resolved like any entity translation
 * (requested locale → default locale). Mirrors a join over
 * `attribute_translations` / `attribute_value_translations`; one cached read
 * serves facets, filter labels and product-page option names.
 */
export async function getAttributeLabels(
  lang: Locale,
): Promise<AttributeLabels> {
  'use cache';
  cacheLife('days');
  cacheTag(cacheTags.attributes);

  const namesByKey = groupTranslationsBy(
    MOCK_ATTRIBUTE_TRANSLATIONS,
    row => row.attributeKey,
  );
  const valuesByKey = groupTranslationsBy(
    MOCK_ATTRIBUTE_VALUE_TRANSLATIONS,
    row => `${row.attributeKey}:${row.valueKey}`,
  );

  const names = Object.fromEntries(
    [...namesByKey].map(([key, rows]) => [
      key,
      pickTranslation(rows, lang)?.name ?? key,
    ]),
  );

  const values: Record<string, Record<string, string>> = {};
  for (const [, rows] of valuesByKey) {
    const row = pickTranslation(rows, lang);
    if (row) {
      values[row.attributeKey] = {
        ...values[row.attributeKey],
        [row.valueKey]: row.label,
      };
    }
  }

  return { names, values };
}
