'use client';

import { type ReactNode, useOptimistic, useTransition } from 'react';

import { routes } from '@/shared/config/routes';
import { usePathname, useRouter } from '@/shared/i18n/navigation';
import { type Locale } from '@/shared/i18n/routing';
import { cn, formatMoney } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import {
  APPEARANCE_OPTION_KEYS,
  findVariantForOption,
  getVariantSlice,
  groupVariantOptions,
  isSelectableGroup,
  isVariantPurchasable,
} from '../../lib/variant-options';
import {
  type LocalizedProduct,
  type ProductVariantTranslation,
} from '../../model/types';

interface ProductInfoSidebarProps {
  product: LocalizedProduct;
  selectedVariant?: ProductVariantTranslation;
  label: {
    collection: string;
    price: string;
    sku: string;
    preOrder: string;
    outOfStock: string;
  };
  lang: Locale;
  /** Purchase action (e.g. add-to-cart) injected by the composing widget. */
  action?: ReactNode;
}

export function ProductInfoSidebar({
  product,
  selectedVariant,
  label,
  lang,
  action,
}: ProductInfoSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // Selection, price and SKU switch at once; the server render (gallery,
  // specifications, cart line) catches up when the navigation commits
  const [current, setCurrent] = useOptimistic(selectedVariant);

  const currentPrice = current?.price ?? { amount: 0, currency: 'UAH' };
  // This page is one colour (its own catalog card): only size-like axes of
  // that colour's SKUs are selectable; the colour is a specification
  const sliceVariants = getVariantSlice(product.variants, current);
  const optionGroups = groupVariantOptions(sliceVariants).filter(
    group => isSelectableGroup(group) && !APPEARANCE_OPTION_KEYS.has(group.key),
  );

  /** Is `nameKey=valueKey` purchasable while keeping the other selected options? */
  const isOptionAvailable = (nameKey: string, valueKey: string) => {
    if (!current) {
      return false;
    }
    return sliceVariants.some(
      variant =>
        variant.options.some(
          o => o.nameKey === nameKey && o.valueKey === valueKey,
        ) &&
        current.options
          .filter(o => o.nameKey !== nameKey)
          .every(selected =>
            variant.options.some(
              o =>
                o.nameKey === selected.nameKey &&
                o.valueKey === selected.valueKey,
            ),
          ) &&
        isVariantPurchasable(variant),
    );
  };

  const handleOptionSelect = (nameKey: string, valueKey: string) => {
    if (!current) {
      return;
    }

    // Keeps the other selected options when such a SKU exists
    const nextVariant = findVariantForOption(
      sliceVariants,
      nameKey,
      valueKey,
      current,
    );

    if (nextVariant?.sku && nextVariant.sku !== current.sku) {
      const query = new URLSearchParams({ variant: nextVariant.sku });
      startTransition(() => {
        setCurrent(nextVariant);
        router.replace(`${pathname}?${query.toString()}`, { scroll: false });
      });
    }
  };

  const isSelected = (nameKey: string, valueKey: string) =>
    current?.options.some(
      o => o.nameKey === nameKey && o.valueKey === valueKey,
    ) ?? false;

  return (
    <div
      className="flex flex-col gap-6"
      data-variant-pending={isPending || undefined}
    >
      {/* Title → collection 16 → 20px; collection → price 24 → 32px */}
      <div className="flex flex-col gap-4 md:gap-5">
        {/* Base name only: colour/size live in the selectors and specs.
            The code follows the optimistic SKU, so it switches with the price */}
        <div className="flex flex-col gap-1.5">
          <Heading
            headingLevel="h1"
            variant="productPage"
            className="tracking-tight"
          >
            {product.title}
          </Heading>
          {current?.sku && (
            <Text size="small" variant="muted">
              {label.sku}: <span className="tabular-nums">{current.sku}</span>
            </Text>
          )}
        </div>

        {product.primaryCollection.title && (
          <Text size="none" className="text-sm font-medium md:text-base">
            {label.collection}:{' '}
            <AppLink
              href={routes.collection(product.primaryCollection.slug)}
              className="text-accent-foreground hover:text-action-primary-hover focus-visible:ring-ring duration-(--dur-normal) ease-subtle underline decoration-transparent decoration-1 underline-offset-4 outline-none transition-[color,text-decoration-color] hover:decoration-current focus-visible:ring-2"
            >
              {product.primaryCollection.title}
            </AppLink>
          </Text>
        )}

        <div className="mt-2 flex items-center gap-3 md:mt-3">
          <Text
            as="span"
            size="none"
            className="text-commerce-price-current text-lg font-medium tabular-nums md:text-xl"
          >
            {label.price}: {formatMoney(currentPrice, lang)}
          </Text>
          {current?.compareAtPrice && (
            <Text
              as="span"
              size="none"
              className="text-commerce-price-old text-sm tabular-nums line-through md:text-base"
            >
              {formatMoney(current.compareAtPrice, lang)}
            </Text>
          )}
        </div>
      </div>

      {optionGroups.length > 0 && (
        <div
          className={cn(
            'duration-(--dur-normal) flex flex-col gap-5 transition-opacity',
            isPending && 'opacity-70',
          )}
          aria-busy={isPending}
        >
          {optionGroups.map(group => {
            const selectedLabel = current?.options.find(
              o => o.nameKey === group.key,
            )?.value;

            return (
              <fieldset key={group.key} className="flex flex-col gap-3">
                <Text
                  as="legend"
                  size="none"
                  className="mb-3 flex items-baseline gap-2 text-sm"
                >
                  <span className="text-foreground-emphasis font-medium">
                    {group.title}
                  </span>
                  {selectedLabel && (
                    <span className="text-muted-foreground">
                      {selectedLabel}
                    </span>
                  )}
                </Text>

                <div className="flex flex-wrap items-center gap-2.5">
                  {[...group.values].map(([valueKey, valueLabel]) => {
                    const selected = isSelected(group.key, valueKey);
                    const available = isOptionAvailable(group.key, valueKey);
                    const title = available
                      ? valueLabel
                      : `${valueLabel} (${label.outOfStock})`;

                    return (
                      <button
                        key={valueKey}
                        type="button"
                        disabled={!available}
                        aria-pressed={selected}
                        data-selected={selected}
                        title={title}
                        onClick={() => handleOptionSelect(group.key, valueKey)}
                        className={cn(
                          'focus-visible:ring-ring duration-(--dur-normal) ease-subtle h-9 min-w-12 cursor-pointer border px-3 text-sm tabular-nums outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-2 md:h-10 md:min-w-16 md:px-4',
                          'border-border-strong bg-background text-foreground hover:border-action-primary hover:text-foreground-emphasis',
                          // Selected: wine edge (2px without a layout shift) on a blush surface
                          'data-[selected=true]:border-action-primary data-[selected=true]:bg-surface-brand-subtle data-[selected=true]:text-accent-foreground data-[selected=true]:font-medium data-[selected=true]:shadow-[inset_0_0_0_1px_var(--color-action-primary)]',
                          'disabled:border-border disabled:text-muted-foreground disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:line-through',
                        )}
                      >
                        {valueLabel}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}

      {current?.stock.status === 'pre_order' && (
        <Text
          size="none"
          className="text-status-warning-fg text-sm font-medium"
        >
          {label.preOrder}
        </Text>
      )}

      {/* Not clickable until the server render commits the new SKU's cart line;
          mt-6 + gap-6 = 48px of air above the CTA */}
      <div inert={isPending} className="mt-6">
        {action}
      </div>
    </div>
  );
}
