import { type ProductVariantTranslation } from '../model/types';

/**
 * Групує всі доступні унікальні значення опцій для товару
 * Наприклад: { volume: ['250_ml', '350_ml'], color: ['forest_green', 'milky_white'] }
 */
export function getAvailableOptionsMap(variants: ProductVariantTranslation[]) {
  const optionsMap: Record<string, Set<string>> = {};

  variants.forEach(variant => {
    variant.options.forEach(opt => {
      if (!optionsMap[opt.nameKey]) {
        optionsMap[opt.nameKey] = new Set();
      }
      optionsMap[opt.nameKey]?.add(opt.valueKey);
    });
  });

  return Object.fromEntries(
    Object.entries(optionsMap).map(([key, set]) => [key, Array.from(set)]),
  );
}

/**
 * Пошук конкретного варіанта за обраними клієнтом опціями
 * selectedOptions = { volume: '250_ml', color: 'forest_green' }
 */
export function findVariantByOptions(
  variants: ProductVariantTranslation[],
  selectedOptions: Record<string, string>,
): ProductVariantTranslation | undefined {
  return variants.find(variant =>
    Object.entries(selectedOptions).every(([nameKey, valueKey]) =>
      variant.options.some(
        opt => opt.nameKey === nameKey && opt.valueKey === valueKey,
      ),
    ),
  );
}

/**
 * Сортування варіантів за ціною (від дешевшого до дорожчого)
 */
export function sortVariantsByPrice(
  variants: ProductVariantTranslation[],
  order: 'asc' | 'desc' = 'asc',
): ProductVariantTranslation[] {
  return [...variants].sort((a, b) => {
    return order === 'asc'
      ? a.price.amount - b.price.amount
      : b.price.amount - a.price.amount;
  });
}
