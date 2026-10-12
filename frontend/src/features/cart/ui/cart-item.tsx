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

interface CartItemCardProps {
  line: CartLine;
  onQuantityChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({
  line,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const t = useTranslations('common');
  const lang = useLocale() as Locale;

  return (
    <article className="border-border flex items-center gap-4 border-b py-5 last:border-0 sm:gap-6">
      <div className="bg-muted relative size-20 shrink-0 overflow-hidden sm:size-24">
        <AppMedia
          src={line.image}
          alt={line.title}
          fill
          sizes="96px"
          className="object-contain p-1"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <AppLink
          href={routes.product(line.slug)}
          className="font-heading text-foreground hover:text-foreground/70 line-clamp-2 text-base leading-snug sm:text-lg"
        >
          {line.title}
        </AppLink>

        {line.variantLabel && (
          <Text as="span" size="none" className="text-muted-foreground text-xs">
            {line.variantLabel}
          </Text>
        )}

        <Text
          as="span"
          size="none"
          className="text-commerce-price-current text-sm font-medium tabular-nums sm:text-base"
        >
          {formatMoney(line.price, lang)}
        </Text>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Text
              as="span"
              size="none"
              className="text-muted-foreground text-sm"
            >
              {t('label.quantity')}:
            </Text>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuantityChange(line.id, -1)}
                aria-label={t('cart.decrease')}
                className="text-muted-foreground hover:text-foreground size-7"
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
                aria-label={t('cart.increase')}
                className="text-muted-foreground hover:text-foreground size-7"
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
            className="text-muted-foreground hover:text-status-error-fg"
          >
            <Icon name="delete-cart" className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
