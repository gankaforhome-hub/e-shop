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

export default function ProductPage() {
  return (
    <>
      <BlankPage />
    </>
  );
}
