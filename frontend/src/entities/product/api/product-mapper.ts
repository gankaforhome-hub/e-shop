import { type Product, type ProductCardDTO } from '../model/types';

export function mapProductToCard(product: Product): ProductCardDTO {
  const primaryMedia = product.media[0];
  const hoverMedia = product.media[1];

  if (!primaryMedia) {
    throw new Error(`Product ${product.id} has no primary media`);
  }

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,

    title: product.title,

    media: {
      primary: primaryMedia,
      ...(hoverMedia ? { hover: hoverMedia } : {}),
    },

    price: product.price,

    ...(product.compareAtPrice && {
      compareAtPrice: product.compareAtPrice,
    }),
    ...(product.badges && {
      badges: product.badges,
    }),
    stock: product.stock,
    category: product.category,
    primaryCollection: product.primaryCollection,

    isFavorite: product.isFavorite ?? false,
  };
}
