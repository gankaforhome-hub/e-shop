import { notFound } from 'next/navigation';

import { getProductBySlug } from '@/entities/product/api/get-products';
import { createRoute } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { BlankPage } from '@/widgets/blank-page';

// export async function generateMetadata({ params }: IGetMetadataProps): Promise<Metadata> {
//   const { lang, slug } = await params;
//   const product = await getProductBySlug(slug, lang);

//   return buildMetadata({
//     meta: {
//       title: product.name,
//       description: product.shortDescription,
//       openGraph: {
//         title: product.name,
//         description: product.shortDescription,
//       },
//     },
//     lang,
//     path: `/product/${slug}`,
//   });
// }

interface ProductPageProps {
  params: Promise<{ productSlug: string; lang: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug, lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }
  const dict = await getDictionary(['common'], lang);
  const product = await getProductBySlug(productSlug, lang);
  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dict.common.navigation.main.collections,
            href: createRoute('/collections'),
          },
          {
            label: product.primaryCollection.title,
            href: createRoute(`/collection/${product.primaryCollection.slug}`),
          },
        ]}
      />
      <BlankPage />
    </>
  );
}
