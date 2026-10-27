import { type ReactNode } from 'react';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';

import { ProductAccordions } from './product-accordions';
import { ProductGallery } from './product-gallery';
import { ProductInfoSidebar } from './product-info-sidebar';
import { getAttributeLabels } from '../../api/get-attribute-labels';
import {
  getVariantGallery,
  resolveSelectedVariant,
} from '../../lib/product-mapper';
import { getProductSpecs } from '../../lib/product-specs';
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
  const [{ product: dict, common }, attributeLabels] = await Promise.all([
    getDictionary(['product'], lang),
    getAttributeLabels(lang),
  ]);
  const selectedVariant = resolveSelectedVariant(
    product.variants,
    selectedVariantSku,
  );

  // A variant with its own gallery shows only its media (colour/finish
  // differs); otherwise the full product gallery, featured item first
  const gallery = getVariantGallery(product, selectedVariant);
  const activeMediaId = gallery[0]?.id ?? '';
  const specs = getProductSpecs(product, selectedVariant, attributeLabels, {
    weight: dict.weight,
    yes: dict.yes,
    no: dict.no,
  });

  // Two explicit tracks, so the column gap exists once: md 1fr/1fr, lg 7fr/5fr
  // (a 12-col grid would repeat the fluid gap 11×, up to 1980px, and break
  // out of the container). Gap from lg: ~80px at 1024 → 180px at 1920+
  return (
    <div className="font-caption lg:fgapc-0/45 group/pdp grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <ProductGallery
        key={selectedVariant?.mediaIds ? selectedVariant.id : product.id}
        media={gallery}
        title={product.title}
        activeMediaId={activeMediaId}
      />

      <div className="flex min-w-0 flex-col gap-6">
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

        <ProductAccordions product={product} specs={specs} label={dict} />
      </div>
    </div>
  );
}
