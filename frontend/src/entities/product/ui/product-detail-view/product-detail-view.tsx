import {
  type TProduct,
  getMainVariant,
} from '@/entities/product/lib/product-mapper';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';

import { ProductAccordions } from './product-accordions';
import { ProductGallery } from './product-gallery';
import { ProductInfoSidebar } from './product-info-sidebar';

export interface IProductDetailViewProps {
  product: TProduct;
  lang: Locale;
  searchParams?: { variant?: string };
}

export async function ProductDetailView({
  product,
  lang,
  searchParams,
}: IProductDetailViewProps) {
  const dict = await getDictionary(['product'], lang);
  const selectedVariantSku = searchParams?.variant;
  const selectedVariant =
    product.variants.find(v => v.sku === selectedVariantSku) ||
    getMainVariant(product.variants);

  // 2. Визначаємо активне медіа на сервері
  const activeMediaId =
    // searchParams?.media ||
    selectedVariant?.mediaId ||
    product.featuredMediaId ||
    product.media[0]?.id ||
    '';

  return (
    <div className="font-caption grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Клієнтський інтерактивний блок галереї */}
      <ProductGallery
        media={product.media}
        title={product.title}
        activeMediaId={activeMediaId}
      />

      <div className="flex flex-col space-y-6 lg:col-span-5">
        {/* Клієнтський блок вибору варіантів та купівлі */}
        <ProductInfoSidebar
          product={product}
          selectedVariant={selectedVariant}
          label={{
            collection: dict.product.collection,
            price: dict.product.price,
            sku: dict.product.sku,
            addToBag: dict.product.addToBag,
          }}
          lang={lang}
        />

        {/* 100% Серверний компонент акордеона */}
        <ProductAccordions product={product} label={dict.product} />
      </div>
    </div>
  );
}
