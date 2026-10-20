import 'server-only';

import { getTranslations } from 'next-intl/server';

import { type CatalogFacetGroup } from '@/entities/product';
import {
  type CatalogDict,
  formatFilterOptionLabel,
  type FormatAttributeUnit,
  isUiFilterGroup,
} from '@/entities/product/catalog';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';

import { type FilterGroupView } from '../model/types';

/**
 * Turns facet groups into view models. Domain labels (attribute names, values,
 * seasons, collections) come translated from the DAL; this adds only the UI
 * wording from `common.catalog`: group headings for collection / features
 * and ICU unit templates for numeric attributes.
 */
export async function getFilterGroups(
  facets: CatalogFacetGroup[],
  lang: Locale,
): Promise<FilterGroupView[]> {
  const [{ common }, t] = await Promise.all([
    getDictionary(['common'], lang),
    getTranslations({ locale: lang, namespace: 'common.catalog' }),
  ]);

  // Typed against the domain matrix: a missing translation fails check-types
  const dict: CatalogDict = common.catalog;
  const formatUnit: FormatAttributeUnit = (key, value) =>
    t(`units.${key}`, { value });

  return facets.map(group => ({
    param: group.param,
    // Attribute names / values arrive translated from the DAL (translation
    // tables); only UI wording (group headings, units) is resolved here
    label:
      group.label ??
      (isUiFilterGroup(group.param) ? dict.groups[group.param] : group.param),
    options: group.options.map(option => ({
      value: option.value,
      count: option.count,
      label:
        option.label ??
        formatFilterOptionLabel(dict, formatUnit, group.param, option.value),
    })),
  }));
}
