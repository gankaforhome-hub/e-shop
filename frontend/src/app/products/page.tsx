import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { BlankPage } from '@/widgets/blank-page';

// const products: Product[] = [
//   {
//     id: '1',
//     slug: 'easter',
//     title: 'Easter',
//     shortDescription: 'Furniture and decor for modern living spaces.',
//     description:
//       'Discover stylish sofas, coffee tables, storage solutions, and accessories for your living room.',
//     media: {
//       id: '1',
//       type: 'image',
//       src: '/images/collections/easter_2025.webp',
//       alt: 'plate with  hares',
//     } as Media,
//   },
//   {
//     id: '2',
//     slug: 'new-year',
//     title: 'New Year',
//     shortDescription: 'Everything you need for a cozy bedroom.',
//     description:
//       'Browse beds, wardrobes, bedside tables, and bedroom decor in contemporary styles.',
//     media: {
//       id: '2',
//       type: 'image',
//       src: '/images/collections/new_year.webp',
//       alt: 'plate with angels',
//     } as Media,
//   },
//   {
//     id: '3',
//     slug: 'ptahy',
//     title: 'Ptahy',
//     shortDescription: 'Elegant dining furniture for every home.',
//     description:
//       'Explore dining tables, chairs, sideboards, and table accessories.',
//     media: {
//       id: '3',
//       type: 'image',
//       src: '/images/collections/ptahy.webp',
//       alt: 'plate with birds',
//     } as Media,
//   },
// ];

export default function CollectionsPage() {
  return (
    <Section className="fpt-4/6 fpb-10/30">
      <Container>
        <BlankPage />
      </Container>
    </Section>
  );
}
