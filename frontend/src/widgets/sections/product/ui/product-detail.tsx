import {
  getVariantGallery,
  isVariantPurchasable,
  type LocalizedProduct,
  ProductDetailView,
  type ProductVariantTranslation,
} from '@/entities/product';
import { AddToCartButton } from '@/features/cart';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface ProductDetailSectionProps {
  product: LocalizedProduct;
  lang: Locale;
  /** Request-time query; awaited here so the page shell can prerender. */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const toCartLine = (
  product: LocalizedProduct,
  variant: ProductVariantTranslation,
) => ({
  id: variant.id,
  productId: product.id,
  variantId: variant.id,
  sku: variant.sku,
  slug: product.slug,
  title: product.title,
  variantLabel: variant.options.map(o => o.value).join(' · ') || undefined,
  price: variant.price,
  image:
    getVariantGallery(product, variant)[0]?.src ?? '/images/placeholder.jpg',
});

export async function ProductDetailSection({
  product,
  lang,
  searchParams,
}: ProductDetailSectionProps) {
  const [{ variant }, { product: dict }] = await Promise.all([
    searchParams,
    getDictionary(['product'], lang),
  ]);

  return (
    <Section>
      <Container>
        <ProductDetailView
          product={product}
          lang={lang}
          selectedVariantSku={typeof variant === 'string' ? variant : undefined}
          renderAction={selected => {
            const purchasable = selected && isVariantPurchasable(selected);
            return (
              <AddToCartButton
                label={dict.addToBag}
                line={purchasable ? toCartLine(product, selected) : null}
              />
            );
          }}
        />
      </Container>
    </Section>
  );
}
