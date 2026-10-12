import { type ReactNode } from 'react';

import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { cn, formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Badge } from '@/shared/ui/badge';

import { type ProductCardDTO } from '../../model/product-card.dto';

/** Default `sizes` for the catalog grid (2 → 3 → 4 columns). */
const GRID_SIZES =
  '(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

export interface ProductCardProps {
  product: ProductCardDTO;
  favoriteButton?: ReactNode;
  className?: string;
  lang?: Locale;
  /** Pass `index < 2` for above-the-fold cards only. */
  priority?: boolean;
  /** Override when the card is rendered outside the catalog grid. */
  sizes?: string;
}

export const ProductCard = ({
  product,
  favoriteButton,
  className,
  lang,
  priority = false,
  sizes = GRID_SIZES,
}: ProductCardProps) => {
  const mainImage = product.media.primary.src || '/images/placeholder.jpg';
  const hoverImage = product.media.hover?.src;
  const isSoldOut = product.stock.status === 'out_of_stock';

  return (
    <article
      className={cn(
        'font-caption relative flex h-full flex-col overflow-hidden transition-all',
        isSoldOut ? 'opacity-50' : '',
        className,
      )}
    >
      {/* Badges */}
      <div className="fgap-1/2 absolute left-2.5 top-2.5 z-10 flex flex-col">
        {product.badges &&
          product.badges.length > 0 &&
          product.badges.map(badgeKey => {
            return (
              <Badge
                key={badgeKey.id}
                variant={badgeKey.id}
                // className={cn(badgeKey.color)}
              >
                {badgeKey.label}
              </Badge>
            );
          })}
      </div>

      {/* Wishlist Button */}
      <div className="absolute right-2.5 top-2 z-10 flex flex-col">
        {favoriteButton}
      </div>

      {/* Media */}
      <AppLink
        href={routes.product(product.slug)}
        className="block w-full shrink-0"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {/* Main Image */}
          <AppMedia
            src={mainImage}
            alt={product.media.primary.alt || product.title}
            fill
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes={sizes}
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
              alt=""
              fill
              loading="lazy"
              sizes={sizes}
              className={cn(
                product.media.hover?.objectFit === 'contain'
                  ? 'fp-4/12 object-contain'
                  : 'object-cover',
                // 'hidden lg:block',
                'card-surface opacity-0 transition-opacity duration-500 hover:opacity-100',
              )}
            />
          )}
        </div>
      </AppLink>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between gap-1 p-2 pt-1">
        <div className="flex flex-col gap-1">
          {/* Category / Collection Link / //INFO Add if needed*/}
          <span
            // href={routes.collection(product.primaryCollection.slug)}
            className="text-brand text-xs font-semibold capitalize"
          >
            {product.primaryCollection.title}
          </span>

          {/* Title */}
          <AppLink
            href={routes.product(product.slug)}
            className={cn(
              `text-foreground custom-transition leading-1.5 line-clamp-2 text-sm capitalize tracking-wide md:text-base`,
            )}
          >
            <span>{product.title}</span>
          </AppLink>
        </div>

        {/* Pricing & Compare Price */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-commerce-price-current text-sm tabular-nums md:text-base">
              {formatMoney(product.price, lang)}
            </span>
            {/* {product.compareAtPrice && (
              <span className="text-commerce-price-old text-[10px] line-through md:text-xs">
                {formatMoney(product.compareAtPrice)}
              </span>
            )} */}
          </div>
          {product.stock.status !== 'in_stock' && (
            <span
              className={cn(
                'text-commerce-price-current/80 rounded-2xl px-2 text-[10px] tabular-nums md:text-sm',
                product.stock.status === 'low_stock' &&
                  'text-commerce-stock-low',
              )}
            >
              {product.stock.label}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
