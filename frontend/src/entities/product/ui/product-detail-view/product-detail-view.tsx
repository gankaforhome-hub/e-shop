import { type ReactNode } from 'react';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';

import { ProductAccordions } from './product-accordions';
import { ProductGallery } from './product-gallery';
import { ProductInfoSidebar } from './product-info-sidebar';
import { resolveSelectedVariant } from '../../lib/product-mapper';
import {
  type LocalizedProduct,
  type ProductVariantTranslation,
} from '../../model/types';

export interface ProductDetailViewProps {
  product: LocalizedProduct;
  lang: Locale;
  /** SKU from the `?variant=` query; falls back to the main variant. */
  selectedVariantSku?: string;
  /** Renders the purchase action for the resolved variant (composed by a widget). */
  renderAction?: (variant: ProductVariantTranslation | undefined) => ReactNode;
}

export async function ProductDetailView({
  product,
  lang,
  selectedVariantSku,
  renderAction,
}: ProductDetailViewProps) {
  const { product: dict, common } = await getDictionary(['product'], lang);
  const selectedVariant = resolveSelectedVariant(
    product.variants,
    selectedVariantSku,
  );

  const activeMediaId =
    selectedVariant?.mediaId ||
    product.featuredMediaId ||
    product.media[0]?.id ||
    '';

  return (
    <div className="font-caption grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <ProductGallery
        media={product.media}
        title={product.title}
        activeMediaId={activeMediaId}
      />

      <div className="flex flex-col gap-6 lg:col-span-5">
        <ProductInfoSidebar
          product={product}
          selectedVariant={selectedVariant}
          label={{
            collection: dict.collection,
            price: dict.price,
            sku: dict.sku,
            preOrder: common.cart.preOrder,
            outOfStock: common.stock.soldOut,
          }}
          lang={lang}
          action={renderAction?.(selectedVariant)}
        />

        <ProductAccordions product={product} label={dict} />
      </div>
    </div>
  );
}
