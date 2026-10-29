'use client';

import { useLocale } from 'next-intl';

import { type ProductCardDTO } from '@/entities/product/catalog';
import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { cn, formatMoney, toSentenceCase } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

/** Full-width result row; the gutter matches the popover (lg) and the menu. */
export const SEARCH_ROW_CLASS = cn(
  'flex w-full items-center gap-3 px-4 py-2 lg:px-5',
  'hover:bg-muted/60 focus-visible:bg-muted/60 duration-(--dur-fast) transition-colors',
  // Inset ring: an outer one would be clipped by the scrolling list
  'focus-visible:ring-inset focus-visible:ring-offset-0',
);

const THUMB_CLASS = 'size-14 shrink-0 rounded-md';

interface SearchResultRowProps {
  product: ProductCardDTO;
  /** Called when the link is followed (closes the popover or menu). */
  onNavigate: () => void;
}

/** Catalog card in a list row: thumbnail, collection, title, price. */
export function SearchResultRow({ product, onNavigate }: SearchResultRowProps) {
  const lang = useLocale() as Locale;
  const { variant, variantLabel } = product;
  const image = variant.media.primary;
  // Like the catalog card: multi-variant products open on the shown SKU
  const href = routes.product(
    product.slug,
    product.hasVariants ? variant.sku : undefined,
  );
  const hasDiscount =
    variant.compareAtPrice !== undefined &&
    variant.compareAtPrice.amount > variant.price.amount;

  return (
    <AppLink
      href={href}
      onClick={onNavigate}
      data-search-nav
      className={SEARCH_ROW_CLASS}
    >
      <span
        className={cn('card-surface relative overflow-hidden', THUMB_CLASS)}
      >
        <AppMedia
          src={image.src || '/images/placeholder.jpg'}
          alt=""
          fill
          sizes="56px"
          className={
            image.objectFit === 'contain'
              ? 'object-contain p-1'
              : 'object-cover'
          }
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Text
          as="span"
          size="none"
          className="text-brand truncate text-xs font-semibold capitalize"
        >
          {product.primaryCollection.title}
        </Text>
        <Text as="span" size="small" className="line-clamp-2 leading-snug">
          {toSentenceCase(product.title, lang)}
          {variantLabel && (
            <Text as="span" size="none" variant="muted">
              , {variantLabel}
            </Text>
          )}
        </Text>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <Text
          as="span"
          size="none"
          className="text-commerce-price-current text-sm tabular-nums"
        >
          {formatMoney(variant.price, lang)}
        </Text>
        {hasDiscount && (
          <del className="text-commerce-price-old text-xs tabular-nums">
            {formatMoney(variant.compareAtPrice, lang)}
          </del>
        )}
        {variant.stock.status === 'out_of_stock' && (
          <Text as="span" size="none" variant="muted" className="text-xs">
            {variant.stock.label}
          </Text>
        )}
      </span>
    </AppLink>
  );
}

/** Same row geometry as `SearchResultRow`, for the first request. */
export function SearchResultRowSkeleton() {
  return (
    <div className={cn(SEARCH_ROW_CLASS, 'hover:bg-transparent')}>
      <Skeleton className={THUMB_CLASS} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="text-xs">
          <Skeleton className="h-[1lh] w-16" />
        </div>
        <div className="text-sm leading-snug">
          <Skeleton className="h-[1lh] w-3/4" />
        </div>
      </div>
      <div className="text-sm">
        <Skeleton className="h-[1lh] w-14" />
      </div>
    </div>
  );
}
