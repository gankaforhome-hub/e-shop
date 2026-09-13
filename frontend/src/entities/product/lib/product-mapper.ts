import { type Locale } from '@/shared/i18n/routing';

import {
  STOCK_TRANSLATIONS,
  WEIGHT_UNITS_TRANSLATIONS,
} from '../mock/products';
import { type ProductCardDTO } from '../model/product-card.dto';
import {
  type Product,
  type ProductAttributeTranslation,
  type ProductBadgeTranslation,
  type ProductCategoryRef,
  type ProductCollectionRef,
  type ProductOptionTranslation,
  type ProductStock,
  type ProductStockStatus,
  type ProductStockTranslation,
  type ProductTranslation,
  type ProductVariantTranslation,
  type ProductWeight,
  type ProductWeightTranslation,
} from '../model/types';

export const STOCK_PRIORITY: Record<ProductStockStatus, number> = {
  in_stock: 1,
  low_stock: 2,
  pre_order: 3,
  out_of_stock: 4,
};

export interface TProduct extends Omit<
  Product,
  'badges' | 'attributes' | 'variants'
> {
  title: string;
  description: string;
  attributes: ProductAttributeTranslation[];
  category: ProductCategoryRef;
  primaryCollection: ProductCollectionRef;
  badges: ProductBadgeTranslation[];
  variants: ProductVariantTranslation[];
}

// 1. Обчислення статусу зі ЗВИЧАЙНОГО (сирого) ProductStock
export function getStockStatus(stock: ProductStock): ProductStockStatus {
  const threshold = stock.lowStockThreshold ?? 2;

  if (stock.quantity <= 0) {
    return stock.allowBackorder ? 'pre_order' : 'out_of_stock';
  }

  if (stock.quantity <= threshold) {
    return 'low_stock';
  }

  return 'in_stock';
}

// 2. Переклад стоку (викликається ТІЛЬКИ в normalizeProduct)
export function getProductStockTranslation(
  stock: ProductStock,
  lang: Locale = 'uk',
): ProductStockTranslation {
  const status = getStockStatus(stock);
  const statusTranslations = STOCK_TRANSLATIONS[status];
  const translationFn = statusTranslations[lang] ?? statusTranslations.uk;

  return {
    quantity: stock.quantity,
    status,
    label: translationFn(stock.quantity),
  };
}

// 3. Пошук головного варіанта
export function getMainVariant(
  variants?: ProductVariantTranslation[] | null,
): ProductVariantTranslation | undefined {
  if (!Array.isArray(variants) || variants.length === 0) {
    return undefined;
  }

  const availableVariant = variants.find(
    v => v?.stock && (v.stock.quantity > 0 || v.stock.status === 'pre_order'),
  );

  return availableVariant ?? variants[0];
}

// 4. Переклад ваги
export function getProductWeightTranslation(
  weightObj?: ProductWeight,
  lang: Locale = 'uk',
): ProductWeightTranslation | undefined {
  if (!weightObj) {
    return undefined;
  }

  const unitGroup = WEIGHT_UNITS_TRANSLATIONS[weightObj.weightUnit];
  const unitLabel = unitGroup[lang] ?? unitGroup.uk;

  return {
    weight: weightObj.weight,
    weightUnit: weightObj.weightUnit,
    label: `${weightObj.weight} ${unitLabel}`,
  };
}

// 5. Нормалізація сирих даних з БД у TProduct
export function normalizeProduct(
  product: Product,
  translation?: ProductTranslation,
  categoryRelation?: ProductCategoryRef,
  collectionRelation?: ProductCollectionRef,
  badges: ProductBadgeTranslation[] = [],
  lang: Locale = 'uk',
): TProduct {
  const optionsTranslationMap = new Map<string, ProductOptionTranslation>(
    (translation?.options || []).map(opt => [
      `${opt.nameKey}_${opt.valueKey}`,
      opt,
    ]),
  );

  return {
    ...product,
    title: translation?.title ?? '',
    description: translation?.description ?? '',
    attributes: translation?.attributes ?? [],
    category: categoryRelation ?? {
      id: product.categoryId,
      slug: '',
      title: '',
    },
    primaryCollection: collectionRelation ?? {
      id: product.primaryCollectionId,
      slug: '',
      title: '',
    },
    badges,
    variants: (product.variants || []).map(
      (variant): ProductVariantTranslation => {
        const { stock: rawStock, weight: rawWeight, ...restVariant } = variant;

        const stockTranslation = getProductStockTranslation(
          rawStock || { quantity: 0 },
          lang,
        );

        const weightTranslation = getProductWeightTranslation(rawWeight, lang);

        const translatedOptions = (variant.options || []).map(opt => {
          const translatedOpt = optionsTranslationMap.get(
            `${opt.nameKey}_${opt.valueKey}`,
          );
          return {
            nameKey: opt.nameKey,
            name: translatedOpt?.name || opt.nameKey,
            valueKey: opt.valueKey,
            value: translatedOpt?.value || opt.valueKey,
          };
        });

        return {
          ...restVariant,
          stock: stockTranslation,
          options: translatedOptions,
          ...(weightTranslation && { weight: weightTranslation }),
        };
      },
    ),
  };
}

// 6. Мапер TProduct -> ProductCardDTO
export function mapProductToCard(
  product: TProduct,
  lang: Locale = 'uk',
): ProductCardDTO {
  const mainVariant = getMainVariant(product.variants);

  const primaryMedia = product.media.find(
    m => m.id === product.featuredMediaId,
  ) ||
    product.media[0] || {
      id: 'placeholder',
      src: '/images/placeholder.jpg',
      objectFit: 'contain' as const,
    };

  const hoverMedia = product.media.find(m => m.id !== primaryMedia.id);

  const categoryTitle =
    typeof product.category.title === 'string'
      ? product.category.title
      : product.category.title?.[lang] || '';

  const collectionTitle =
    typeof product.primaryCollection.title === 'string'
      ? product.primaryCollection.title
      : product.primaryCollection.title?.[lang] || '';

  return {
    id: product.id,
    slug: product.slug,
    sku: mainVariant?.sku || '',
    title: product.title,
    price: mainVariant?.price || { amount: 0, currency: 'UAH' },
    // Беремо ВЖЕ ОБЧИСЛЕНИЙ stock з mainVariant!
    stock: mainVariant?.stock ?? {
      quantity: 0,
      status: 'out_of_stock',
      label: '',
    },
    // weight вже в потрібній структурі (або undefined)
    ...(mainVariant?.weight && { weight: mainVariant.weight }),
    category: {
      id: product.category.id,
      slug: product.category.slug,
      title: categoryTitle,
    },
    primaryCollection: {
      id: product.primaryCollection.id,
      slug: product.primaryCollection.slug,
      title: collectionTitle,
    },
    media: {
      primary: primaryMedia,
      ...(hoverMedia && { hover: hoverMedia }),
    },
    ...(mainVariant?.compareAtPrice && {
      compareAtPrice: mainVariant.compareAtPrice,
    }),
    badges: product.badges ?? [],
    isFavorite: product.isFavorite ?? false,
    attributes: product.attributes,
    options: mainVariant?.options ?? [],
  };
}
