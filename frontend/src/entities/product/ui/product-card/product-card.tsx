// import { type ReactNode } from 'react';

// import { routes } from '@/shared/config/routes';
// import { cn, formatMoney } from '@/shared/lib/utils';
// import { AppLink } from '@/shared/ui/app-link';
// import { AppMedia } from '@/shared/ui/app-media';
// import { Badge } from '@/shared/ui/badge';
// import { Box } from '@/shared/ui/box';

// import { getBadgeLabel, getStockStatus, type Locale } from '../../model/keys';
// import { type ProductCardDTO } from '../../model/types';

// export interface IProductCard {
//   product: ProductCardDTO;
//   favoriteButton?: ReactNode;
//   className?: string;
// }

// export const ProductCard = ({
//   product,
//   favoriteButton,
//   className,
// }: IProductCard) => {
//   const lang: Locale = 'en';
//   const mainImage = product.media.primary.src || '/images/placeholder.jpg';
//   const hoverImage = product.media.hover?.src;
//   const isSoldOut = product.stock.status === 'sold_out';

//   return (
//     <article
//       className={cn(
//         'relative flex h-full flex-col overflow-hidden transition-all',
//         isSoldOut ? 'opacity-50' : '',
//         className,
//       )}
//     >
//       {/* Badges */}
//       <Box className="fgap-1/2 absolute left-2.5 top-2.5 z-10 flex flex-col">
//         {product.badges &&
//           product.badges.length > 0 &&
//           product.badges.map(badgeKey => {
//             return (
//               <Badge key={badgeKey} variant={badgeKey}>
//                 {getBadgeLabel(lang, badgeKey)}
//               </Badge>
//             );
//           })}
//       </Box>
//       {/* Wishlist Button */}
//       <Box className="absolute right-2.5 top-2 z-10 flex flex-col">
//         {favoriteButton}
//       </Box>
//       {/* Media */}
//       <AppLink
//         href={routes.product(product.slug)}
//         className="block w-full shrink-0"
//       >
//         <Box
//           className={cn(
//             'relative aspect-square w-full overflow-hidden',
//             // 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]',
//           )}
//         >
//           {/* Main Image */}
//           <AppMedia
//             src={mainImage}
//             alt={product.media.primary.alt || product.title}
//             fill
//             loading="lazy"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//             className={cn(
//               'card-surface transition-opacity duration-500',
//               product.media.primary.objectFit === 'contain'
//                 ? 'fp-4/12 object-contain'
//                 : 'object-cover',
//               hoverImage ? 'hover:opacity-0' : 'hover:scale-105',
//             )}
//           />
//           {/* Secondary Hover Image */}
//           {hoverImage && (
//             <AppMedia
//               src={hoverImage}
//               alt={product.media.hover?.alt || product.title}
//               fill
//               loading="lazy"
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//               className={cn(
//                 product.media.hover?.objectFit === 'contain'
//                   ? 'fp-4/12 object-contain'
//                   : 'object-cover',
//                 'card-surface opacity-0 transition-opacity duration-500 hover:opacity-100',
//               )}
//             />
//           )}
//         </Box>
//       </AppLink>
//       {/* Product Details*/}
//       <Box className="flex flex-1 flex-col justify-between gap-1 p-2 pt-1">
//         <Box className="flex flex-col gap-1">
//           {/* Category / Collection Link */}
//           <AppLink
//             href={routes.collection(product.primaryCollection.slug)}
//             className="text-brand-primary hover:text-brand-hover text-xs font-semibold capitalize"
//           >
//             {product.primaryCollection.title}
//           </AppLink>
//           {/* Title */}
//           <AppLink
//             href={routes.product(product.slug)}
//             className={cn(
//               `text-text-primary custom-transition leading-1.5 line-clamp-2 text-sm capitalize tracking-wide md:text-base`,
//             )}
//           >
//             <span className="text-underline-animation">{product.title}</span>
//           </AppLink>
//         </Box>

//         {/* Pricing & Compare Price*/}
//         <Box className="flex flex-wrap items-center justify-between">
//           <Box className="flex items-baseline gap-2">
//             <span className="text-price-current text-sm md:text-base">
//               {formatMoney(product.price)}
//             </span>
//             {product.compareAtPrice && (
//               <span className="text-price-old text-[10px] line-through md:text-xs">
//                 {formatMoney(product.compareAtPrice)}
//               </span>
//             )}
//           </Box>
//           {product.stock.status !== 'in_stock' && (
//             <span
//               className={cn(
//                 'text-price-current/80 bg-stock-warning rounded-2xl px-2 text-[10px] md:text-sm',
//                 product.stock.status === 'low_stock' ? 'text-brand-active' : '',
//               )}
//             >
//               {getStockStatus(lang, product.stock.status)}
//             </span>
//           )}
//         </Box>
//       </Box>
//     </article>
//   );
// };
import { type ReactNode } from 'react';

import { routes } from '@/shared/config/routes';
import { cn, formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/box';

import { getBadgeLabel, getStockStatus, type Locale } from '../../model/keys';
import { type ProductCardDTO } from '../../model/types';

export interface IProductCard {
  product: ProductCardDTO;
  favoriteButton?: ReactNode;
  className?: string;
  /** Передавайте priority={index < 2} для карток на першому екрані */
  priority?: boolean;
}

export const ProductCard = ({
  product,
  favoriteButton,
  className,
  priority = false,
}: IProductCard) => {
  const lang: Locale = 'en';
  const mainImage = product.media.primary.src || '/images/placeholder.jpg';
  const hoverImage = product.media.hover?.src;
  const isSoldOut = product.stock.status === 'sold_out';

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden transition-all',
        isSoldOut ? 'opacity-50' : '',
        className,
      )}
    >
      {/* Badges */}
      <Box className="fgap-1/2 absolute left-2.5 top-2.5 z-10 flex flex-col">
        {product.badges &&
          product.badges.length > 0 &&
          product.badges.map(badgeKey => {
            return (
              <Badge key={badgeKey} variant={badgeKey}>
                {getBadgeLabel(lang, badgeKey)}
              </Badge>
            );
          })}
      </Box>

      {/* Wishlist Button */}
      <Box className="absolute right-2.5 top-2 z-10 flex flex-col">
        {favoriteButton}
      </Box>

      {/* Media */}
      <AppLink
        href={routes.product(product.slug)}
        className="block w-full shrink-0"
      >
        <Box className="relative aspect-square w-full overflow-hidden">
          {/* Main Image */}
          <AppMedia
            src={mainImage}
            alt={product.media.primary.alt || product.title}
            fill
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'card-surface transition-opacity duration-500',
              product.media.primary.objectFit === 'contain'
                ? 'fp-4/12 object-contain'
                : 'object-cover',
              hoverImage ? 'lg:hover:opacity-0' : 'hover:scale-105',
            )}
          />

          {/* Secondary Hover Image */}
          {hoverImage && (
            <AppMedia
              src={hoverImage}
              alt={product.media.hover?.alt || product.title}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 50vw, 25vw"
              className={cn(
                product.media.hover?.objectFit === 'contain'
                  ? 'fp-4/12 object-contain'
                  : 'object-cover',
                // 'hidden lg:block',
                'card-surface opacity-0 transition-opacity duration-500 hover:opacity-100',
              )}
            />
          )}
        </Box>
      </AppLink>

      {/* Product Details */}
      <Box className="flex flex-1 flex-col justify-between gap-1 p-2 pt-1">
        <Box className="flex flex-col gap-1">
          {/* Category / Collection Link */}
          <AppLink
            href={routes.collection(product.primaryCollection.slug)}
            className="text-brand-primary hover:text-brand-hover text-xs font-semibold capitalize"
          >
            {product.primaryCollection.title}
          </AppLink>

          {/* Title */}
          <AppLink
            href={routes.product(product.slug)}
            className={cn(
              `text-text-primary custom-transition leading-1.5 line-clamp-2 text-sm capitalize tracking-wide md:text-base`,
            )}
          >
            <span className="text-underline-animation">{product.title}</span>
          </AppLink>
        </Box>

        {/* Pricing & Compare Price */}
        <Box className="flex flex-wrap items-center justify-between">
          <Box className="flex items-baseline gap-2">
            <span className="text-price-current text-sm md:text-base">
              {formatMoney(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-price-old text-[10px] line-through md:text-xs">
                {formatMoney(product.compareAtPrice)}
              </span>
            )}
          </Box>
          {product.stock.status !== 'in_stock' && (
            <span
              className={cn(
                'text-price-current/80 bg-stock-warning rounded-2xl px-2 text-[10px] md:text-sm',
                product.stock.status === 'low_stock' ? 'text-brand-active' : '',
              )}
            >
              {getStockStatus(lang, product.stock.status)}
            </span>
          )}
        </Box>
      </Box>
    </article>
  );
};
