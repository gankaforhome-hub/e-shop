import { type Locale } from '@/shared/i18n/routing';

import { NOVA_POSHTA_CITIES } from '../mock/nova-poshta-cities';

export type NovaPoshtaPointType = 'branch' | 'locker';

export type NovaPoshtaPoint = {
  type: NovaPoshtaPointType;
  number: number;
  address: Record<Locale, string>;
};

export type NovaPoshtaCity = {
  id: string;
  name: Record<Locale, string>;
  points: readonly NovaPoshtaPoint[];
};

// Users type apostrophes and letter case inconsistently ("Кам’янське" vs "кам'янське")
const normalize = (value: string) =>
  value.trim().toLocaleLowerCase('uk').replace(/[’ʼ`]/g, "'");

/** Exact (case/apostrophe-insensitive) match against any locale's city name. */
export function findNovaPoshtaCity(query: string): NovaPoshtaCity | undefined {
  const needle = normalize(query);
  if (!needle) {
    return undefined;
  }

  return NOVA_POSHTA_CITIES.find(city =>
    Object.values(city.name).some(name => normalize(name) === needle),
  );
}

export const getNovaPoshtaCityNames = (lang: Locale): string[] =>
  NOVA_POSHTA_CITIES.map(city => city.name[lang]);

export const getNovaPoshtaPoints = (
  city: NovaPoshtaCity,
  type: NovaPoshtaPointType,
): NovaPoshtaPoint[] => city.points.filter(point => point.type === type);

/** "Відділення №5: вул. Федорова, 32" — also the value stored in the order. */
export const formatNovaPoshtaPoint = (
  point: NovaPoshtaPoint,
  typeLabel: string,
  lang: Locale,
) => `${typeLabel} №${point.number}: ${point.address[lang]}`;
