'use client';

import { useLocale, useTranslations } from 'next-intl';

import { type FavoriteItem } from '@/features/add-to-favorite';
import { AddToCartButton } from '@/features/cart';
import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

interface FavoriteRowProps {
  item: FavoriteItem;
  onRemove: (productId: string) => void;
  /** The line went into the bag (the panel then drops it from the wishlist). */
  onAddedToBag: (productId: string) => void;
  /** Called when a product link is followed (closes the drawer). */
  onNavigate: () => void;
}

// Compact outline row action (border on the drawer background). One fixed width for
// every state and language: 144px fits the longest label ("✓ Додано у кошик",
// "Немає в наявності"), so rows align and nothing jumps on "Added" or a
// language switch. On a 320px drawer the mobile image/gaps below leave exactly
// 144px beside the remove button
const ACTION_CLASS = 'h-8 w-36 shrink-0 px-2 py-0 shadow-none';

/** Cart-row twin: image, title, price; "Add to bag" instead of quantity. */
export function FavoriteRow({
  item,
  onRemove,
  onAddedToBag,
  onNavigate,
}: FavoriteRowProps) {
  const t = useTranslations('common.favorites');
  const lang = useLocale() as Locale;
  const href = routes.product(item.slug);

  return (
    <article className="flex items-center gap-3 p-3 sm:gap-5">
      {/* Duplicate of the title link for pointer users; skipped by keyboard/AT */}
      <AppLink
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-background relative size-16 shrink-0 overflow-hidden sm:size-24"
      >
        <AppMedia
          src={item.image}
          alt=""
          fill
          sizes="96px"
          className="object-contain p-1"
        />
      </AppLink>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <AppLink
          href={href}
          onClick={onNavigate}
          className="text-foreground hover:text-foreground-emphasis duration-(--dur-normal) line-clamp-2 text-base leading-snug transition-colors sm:text-lg"
        >
          {item.title}
        </AppLink>

        <Text
          as="span"
          size="none"
          className="text-commerce-price-current text-sm font-medium tabular-nums sm:text-base"
        >
          {formatMoney(item.price, lang)}
        </Text>

        <div className="flex items-center justify-between gap-3 pt-2 sm:gap-4">
          {item.action === 'options' ? (
            <Button
              asChild
              variant="outline"
              size="small"
              className={ACTION_CLASS}
            >
              <AppLink href={href} onClick={onNavigate}>
                {t('chooseOptions')}
              </AppLink>
            </Button>
          ) : (
            <AddToCartButton
              line={item.cartLine}
              label={item.action === 'soldOut' ? t('soldOut') : t('addToCart')}
              openCart={false}
              size="small"
              variant="outline"
              onAdded={() => onAddedToBag(item.productId)}
              className={ACTION_CLASS}
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.productId)}
            aria-label={t('remove')}
            className="text-muted-foreground hover:text-status-error-fg shrink-0"
          >
            <Icon name="delete-cart" className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
