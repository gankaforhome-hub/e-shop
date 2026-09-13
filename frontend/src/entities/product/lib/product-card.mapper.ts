// import { type TProduct } from './product-mapper';
// import { type ProductCardDTO } from '../model/product-card.dto';

// export function mapProductToCard(product: TProduct): ProductCardDTO {
//   // 1. Беремо перше фото як основне, або підставляємо безпечний placeholder
//   const primaryMedia = product.media[0] ?? {
//     id: 'placeholder',
//     src: '/images/placeholder.jpg',
//     alt: product.title,
//   };

//   // 2. Друге фото використовуємо для ефекту hover (якщо воно є)
//   const hoverMedia = product.media[1];

//   // 3. Формуємо мінімальний DTO для UI картки
//   return {
//     id: product.id,
//     slug: product.slug,
//     sku: product.sku,
//     title: product.title,
//     price: product.price,
//     stock: product.stock,
//     category: product.category,
//     primaryCollection: product.primaryCollection,

//     media: {
//       primary: primaryMedia,
//       ...(hoverMedia && { hover: hoverMedia }),
//     },

//     ...(product.compareAtPrice && {
//       compareAtPrice: product.compareAtPrice,
//     }),

//     ...(product.badges && {
//       badges: product.badges,
//     }),

//     isFavorite: product.isFavorite ?? false,
//   };
// }
