import { type Locale } from '@/shared/i18n/routing';

import { type DescribeVariantAttribute } from './attribute-labels';
import { getStockStatus } from './get-stock-status';
import {
  STOCK_TRANSLATIONS,
  WEIGHT_UNITS_TRANSLATIONS,
} from '../config/labels';
import { VARIANT_ATTRIBUTE_KEYS } from '../model/attributes';
import {
  type ProductCardDTO,
  type ProductCardVariant,
} from '../model/product-card.dto';
import {
  type LocalizedProduct,
  type Product,
  type ProductMedia,
  type LocalizedProductBadge,
  type ProductCategoryRef,
  type ProductCollectionRef,
  type ProductOptionTranslation,
  type ProductStock,
  type ProductStockStatus,
  type ProductStockTranslation,
  type ProductTranslation,
  type ProductVariant,
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

/** Localized stock status and label (used by `normalizeProduct`). */
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

export const isVariantPurchasable = (
  variant: Pick<ProductVariantTranslation, 'stock'>,
): boolean =>
  variant.stock.quantity > 0 || variant.stock.status === 'pre_order';

/** First purchasable variant, else the first one. */
export function getMainVariant(
  variants?: ProductVariantTranslation[] | null,
): ProductVariantTranslation | undefined {
  if (!Array.isArray(variants) || variants.length === 0) {
    return undefined;
  }

  const availableVariant = variants.find(
    v => v?.stock && isVariantPurchasable(v),
  );

  return availableVariant ?? variants[0];
}

/** Variant chosen via `?variant=<sku>`, else the main (first purchasable) variant. */
export function resolveSelectedVariant(
  variants: ProductVariantTranslation[],
  sku?: string,
): ProductVariantTranslation | undefined {
  return (
    (sku ? variants.find(v => v.sku === sku) : undefined) ??
    getMainVariant(variants)
  );
}

/** Localized weight label ("350 г"). */
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

const PLACEHOLDER_MEDIA: ProductMedia = {
  id: 'placeholder',
  src: '/images/placeholder.jpg',
  objectFit: 'contain',
};

/**
 * Ordered gallery of a variant: its own `mediaIds` when set, otherwise the
 * product media with the featured item first.
 */
export function getVariantGallery(
  product: Pick<LocalizedProduct, 'media' | 'featuredMediaId'>,
  variant?: Pick<ProductVariantTranslation, 'mediaIds'>,
): ProductMedia[] {
  const own = (variant?.mediaIds ?? []).flatMap(
    id => product.media.find(m => m.id === id) ?? [],
  );
  if (own.length > 0) {
    return own;
  }

  const featured = product.media.find(m => m.id === product.featuredMediaId);
  return featured
    ? [featured, ...product.media.filter(m => m !== featured)]
    : product.media;
}

const rawVariantAttribute: DescribeVariantAttribute = (key, value) => ({
  name: key,
  value: String(value),
});

/** Variant attributes as selectable options, in `VARIANT_ATTRIBUTE_KEYS` order. */
function getAttributeOptions(
  variant: ProductVariant,
  describe: DescribeVariantAttribute,
): ProductOptionTranslation[] {
  return VARIANT_ATTRIBUTE_KEYS.flatMap(key => {
    const value = variant.attributes[key];
    if (value === undefined) {
      return [];
    }
    const label = describe(key, value);
    return [
      {
        nameKey: key,
        name: label.name,
        valueKey: String(value),
        value: label.value,
      },
    ];
  });
}

/** Raw product + translation row + refs → `LocalizedProduct`. */
export function normalizeProduct(
  product: Product,
  translation?: ProductTranslation,
  categoryRelation?: ProductCategoryRef,
  collectionRelation?: ProductCollectionRef,
  badges: LocalizedProductBadge[] = [],
  lang: Locale = 'uk',
  /** Localizes variant attributes (`getLocalizedProducts` passes the dictionary). */
  describeAttribute: DescribeVariantAttribute = rawVariantAttribute,
): LocalizedProduct {
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
    ...(translation?.seo && { seo: translation.seo }),
    characteristics: translation?.characteristics ?? [],
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
          options: [
            ...getAttributeOptions(variant, describeAttribute),
            ...translatedOptions,
          ],
          ...(weightTranslation && { weight: weightTranslation }),
        };
      },
    ),
  };
}

function toCardVariant(
  product: LocalizedProduct,
  variant: ProductVariantTranslation,
): ProductCardVariant {
  const [primary = PLACEHOLDER_MEDIA, ...rest] = getVariantGallery(
    product,
    variant,
  );
  // A hover image only makes sense if it actually looks different
  const hover = rest.find(media => media.src !== primary.src);

  return {
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    ...(variant.compareAtPrice && { compareAtPrice: variant.compareAtPrice }),
    stock: variant.stock,
    media: { primary, ...(hover && { hover }) },
  };
}

/**
 * LocalizedProduct → card DTO. `selectedVariant` (e.g. the SKU matching the
 * active filters) wins over the main variant.
 */
export function mapProductToCard(
  product: LocalizedProduct,
  selectedVariant?: ProductVariantTranslation,
): ProductCardDTO {
  const selected = selectedVariant ?? getMainVariant(product.variants);

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: {
      id: product.category.id,
      slug: product.category.slug,
      title: product.category.title,
    },
    primaryCollection: {
      id: product.primaryCollection.id,
      slug: product.primaryCollection.slug,
      title: product.primaryCollection.title,
    },
    badges: product.badges ?? [],
    variant: selected
      ? toCardVariant(product, selected)
      : {
          id: `${product.id}-placeholder`,
          sku: '',
          price: { amount: 0, currency: 'UAH' },
          stock: { quantity: 0, status: 'out_of_stock', label: '' },
          media: { primary: PLACEHOLDER_MEDIA },
        },
    hasVariants: product.variants.length > 1,
    isFavorite: false,
  };
}
