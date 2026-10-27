'use client';

import { useLocale, useTranslations } from 'next-intl';

import { type CartLine } from '@/entities/cart';
import { routes } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { AppMedia } from '@/shared/ui/app-media';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { MAX_LINE_QUANTITY, MIN_LINE_QUANTITY } from '../model/cart-store';

interface CartItemCardProps {
  line: CartLine;
  onQuantityChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  /** Called when a product link is followed (closes the drawer). */
  onNavigate?: () => void;
}

export function CartItemCard({
  line,
  onQuantityChange,
  onRemove,
  onNavigate,
}: CartItemCardProps) {
  const t = useTranslations('common');
  const lang = useLocale() as Locale;

  return (
    // Soft card instead of divider lines: items read apart by surface + gap
    <article className="flex items-center gap-4 p-3 sm:gap-5">
      {/* Duplicate of the title link for pointer users; skipped by keyboard/AT */}
      <AppLink
        href={routes.product(line.slug)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-background relative size-20 shrink-0 overflow-hidden sm:size-24"
      >
        <AppMedia
          src={line.image}
          alt=""
          fill
          sizes="96px"
          className="object-contain p-1"
        />
      </AppLink>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <AppLink
          href={routes.product(line.slug)}
          onClick={onNavigate}
          className="text-foreground hover:text-foreground-emphasis duration-(--dur-normal) line-clamp-2 text-base leading-snug transition-colors sm:text-lg"
        >
          {line.title}
        </AppLink>

        <Text
          as="span"
          size="none"
          className="text-commerce-price-current text-sm font-medium tabular-nums sm:text-base"
        >
          {formatMoney(line.price, lang)}
        </Text>

        {/* Stepper and delete sit at opposite ends with a guaranteed gap; the
            "Quantity:" label only shows from sm (the drawer is 320px on phones) */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Text
              as="span"
              size="none"
              className="text-muted-foreground text-sm max-sm:sr-only"
            >
              {t('label.quantity')}:
            </Text>
            <div className="border-border flex items-center gap-1 border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(line.id, -1)}
                disabled={line.quantity <= MIN_LINE_QUANTITY}
                aria-label={t('cart.decrease')}
                className="text-muted-foreground hover:text-foreground size-8 disabled:opacity-40"
              >
                <Icon name="minus" className="size-3.5" aria-hidden="true" />
              </Button>
              <Text
                as="span"
                size="none"
                className="w-5 text-center text-sm tabular-nums"
                aria-live="polite"
              >
                {line.quantity}
              </Text>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(line.id, 1)}
                disabled={line.quantity >= MAX_LINE_QUANTITY}
                aria-label={t('cart.increase')}
                className="text-muted-foreground hover:text-foreground size-8 disabled:opacity-40"
              >
                <Icon name="plus" className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(line.id)}
            aria-label={t('cart.remove')}
            className="text-muted-foreground hover:text-status-error-fg shrink-0"
          >
            <Icon name="delete-cart" className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
