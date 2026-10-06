import { type TProduct } from '@/entities/product/lib/product-mapper';
import { ProductDetailView } from '@/entities/product/ui/product-detail-view/product-detail-view';
import { type Locale } from '@/shared/i18n/routing';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface IProductDetailSectionProps {
  product: TProduct;
  lang: Locale;
  searchParams?: { variant?: string };
}

export function ProductDetailSection({
  product,
  lang,
  searchParams,
}: IProductDetailSectionProps) {
  return (
    <Section>
      <Container>
        <ProductDetailView
          product={product}
          lang={lang}
          searchParams={searchParams}
        />
        {/* <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify(product, null, 2)}
        </pre> */}
      </Container>
    </Section>
  );
}
