'use client';

import { type ReactNode, useTransition } from 'react';

import { usePathname, useRouter } from '@/shared/i18n/navigation';
import { type Locale } from '@/shared/i18n/routing';
import { cn, formatMoney } from '@/shared/lib/utils';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

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

type OptionGroup = {
  key: string;
  title: string;
  values: Map<string, string>;
};

const COLOR_OPTION_KEYS = new Set(['color', 'glaze']);

const isVariantPurchasable = (variant: ProductVariantTranslation) =>
  variant.stock.quantity > 0 || variant.stock.status === 'pre_order';

/** Unique option values per option key, in first-seen order. */
function groupOptions(variants: ProductVariantTranslation[]): OptionGroup[] {
  const groups = new Map<string, OptionGroup>();
  for (const variant of variants) {
    for (const opt of variant.options) {
      const group = groups.get(opt.nameKey) ?? {
        key: opt.nameKey,
        title: opt.name || opt.nameKey,
        values: new Map<string, string>(),
      };
      if (!group.values.has(opt.valueKey)) {
        group.values.set(opt.valueKey, opt.value || opt.valueKey);
      }
      groups.set(opt.nameKey, group);
    }
  }
  return [...groups.values()];
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

  const currentPrice = selectedVariant?.price ?? { amount: 0, currency: 'UAH' };
  const optionGroups = groupOptions(product.variants);

  /** Is `nameKey=valueKey` purchasable while keeping the other selected options? */
  const isOptionAvailable = (nameKey: string, valueKey: string) => {
    if (!selectedVariant) {
      return false;
    }
    return product.variants.some(
      variant =>
        variant.options.some(
          o => o.nameKey === nameKey && o.valueKey === valueKey,
        ) &&
        selectedVariant.options
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
    if (!selectedVariant) {
      return;
    }

    const nextOptions = new Map(
      selectedVariant.options.map(opt => [opt.nameKey, opt.valueKey]),
    );
    nextOptions.set(nameKey, valueKey);

    // Exact match on every selected option, else the first variant with this option
    const nextVariant =
      product.variants.find(variant =>
        [...nextOptions].every(([nKey, vKey]) =>
          variant.options.some(o => o.nameKey === nKey && o.valueKey === vKey),
        ),
      ) ??
      product.variants.find(variant =>
        variant.options.some(
          o => o.nameKey === nameKey && o.valueKey === valueKey,
        ),
      );

    if (nextVariant?.sku) {
      const query = new URLSearchParams({ variant: nextVariant.sku });
      startTransition(() => {
        router.replace(`${pathname}?${query.toString()}`, { scroll: false });
      });
    }
  };

  const isSelected = (nameKey: string, valueKey: string) =>
    selectedVariant?.options.some(
      o => o.nameKey === nameKey && o.valueKey === valueKey,
    ) ?? false;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading
          headingLevel="h1"
          variant="productPage"
          className="tracking-tight"
        >
          {product.title}
        </Heading>

        {product.primaryCollection.title && (
          <Text size="none" className="text-sm font-medium md:text-base">
            {label.collection}:{' '}
            <span className="text-accent-foreground underline">
              {product.primaryCollection.title}
            </span>
          </Text>
        )}

        <div className="mt-2 flex items-center gap-3">
          <Text
            as="span"
            size="none"
            className="text-commerce-price-current text-lg font-medium tabular-nums md:text-xl"
          >
            {label.price}: {formatMoney(currentPrice, lang)}
          </Text>
          {selectedVariant?.compareAtPrice && (
            <Text
              as="span"
              size="none"
              className="text-commerce-price-old text-sm tabular-nums line-through md:text-base"
            >
              {formatMoney(selectedVariant.compareAtPrice, lang)}
            </Text>
          )}
        </div>

        <Text size="none" className="text-muted-foreground text-sm">
          {label.sku}: {selectedVariant?.sku || 'N/A'}
        </Text>
      </div>

      {product.variants.length > 1 && (
        <div
          className={cn(
            'duration-(--dur-normal) flex flex-col gap-4 transition-opacity',
            isPending && 'opacity-70',
          )}
          aria-busy={isPending}
        >
          {optionGroups.map(group => {
            const isColorGroup = COLOR_OPTION_KEYS.has(group.key);

            return (
              <fieldset key={group.key} className="flex flex-col gap-2">
                <Text
                  as="legend"
                  size="none"
                  className="text-foreground/80 mb-2 text-sm font-medium capitalize"
                >
                  {group.title}:
                </Text>

                <div className="flex flex-wrap items-center gap-2.5">
                  {[...group.values].map(([valueKey, valueLabel]) => {
                    const selected = isSelected(group.key, valueKey);
                    const available = isOptionAvailable(group.key, valueKey);

                    if (isColorGroup) {
                      const swatchColor = valueKey.startsWith('#')
                        ? valueKey
                        : valueLabel;

                      return (
                        <div
                          key={valueKey}
                          className="flex flex-col items-center gap-1"
                        >
                          <button
                            type="button"
                            disabled={!available}
                            aria-pressed={selected}
                            title={
                              available
                                ? valueLabel
                                : `${valueLabel} (${label.outOfStock})`
                            }
                            onClick={() =>
                              handleOptionSelect(group.key, valueKey)
                            }
                            className={cn(
                              'focus-visible:ring-ring relative size-7 rounded-full p-0.5 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-offset-2',
                              available
                                ? 'cursor-pointer hover:scale-110 motion-reduce:hover:scale-100'
                                : 'cursor-not-allowed opacity-35',
                            )}
                          >
                            <span
                              className="border-foreground/10 relative block size-full overflow-hidden rounded-full border shadow-inner"
                              // Swatch color is product data, not a design token
                              style={{ backgroundColor: swatchColor }}
                            >
                              {!available && (
                                <span className="bg-muted-foreground absolute inset-0 m-auto h-px w-[140%] -rotate-45" />
                              )}
                            </span>
                            <span className="sr-only">{valueLabel}</span>
                          </button>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'bg-foreground duration-(--dur-normal) size-1 rounded-full transition-all',
                              selected
                                ? 'scale-100 opacity-100'
                                : 'scale-0 opacity-0',
                            )}
                          />
                        </div>
                      );
                    }

                    return (
                      <button
                        key={valueKey}
                        type="button"
                        disabled={!available}
                        aria-pressed={selected}
                        data-selected={selected}
                        onClick={() => handleOptionSelect(group.key, valueKey)}
                        className={cn(
                          'focus-visible:ring-ring duration-(--dur-normal) relative border px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
                          'border-border bg-background text-foreground hover:border-border-strong cursor-pointer',
                          'data-[selected=true]:border-foreground data-[selected=true]:bg-foreground data-[selected=true]:text-background',
                          'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60',
                        )}
                      >
                        {valueLabel}
                        {!available && (
                          <span className="bg-muted-foreground absolute inset-0 m-auto h-px w-full -rotate-12" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}

      {selectedVariant?.stock.status === 'pre_order' && (
        <Text
          size="none"
          className="text-status-warning-fg text-sm font-medium"
        >
          {label.preOrder}
        </Text>
      )}

      {action}
    </div>
  );
}
