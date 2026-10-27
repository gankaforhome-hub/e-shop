import 'server-only';

import {
  getLocalizedProducts,
  getMainVariant,
  getVariantGallery,
  isVariantPurchasable,
} from '@/entities/product';
import { type Locale } from '@/shared/i18n/routing';

import { getFavoriteIds } from './get-favorite-ids';
import { type FavoriteItem } from '../model/types';

const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

/** The current user's wishlist in `lang`, in the order items were added. */
export async function getFavoriteItems(lang: Locale): Promise<FavoriteItem[]> {
  const [favoriteIds, products] = await Promise.all([
    getFavoriteIds(),
    getLocalizedProducts(lang),
  ]);
  const byId = new Map(products.map(product => [product.id, product]));

  return [...favoriteIds].flatMap((id): FavoriteItem[] => {
    const product = byId.get(id);
    const variant = product && getMainVariant(product.variants);
    if (!product || !variant) {
      return [];
    }

    const purchasable = isVariantPurchasable(variant);
    const action = !purchasable
      ? 'soldOut'
      : product.variants.length > 1
        ? 'options'
        : 'add';
    const image =
      getVariantGallery(product, variant)[0]?.src ?? PLACEHOLDER_IMAGE;

    return [
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image,
        price: variant.price,
        action,
        cartLine:
          action === 'add'
            ? {
                id: variant.id,
                productId: product.id,
                variantId: variant.id,
                sku: variant.sku,
                slug: product.slug,
                title: product.title,
                locale: lang,
                variantLabel:
                  variant.options.map(o => o.value).join(' · ') || undefined,
                price: variant.price,
                image,
              }
            : null,
      },
    ];
  });
}
