import { CollectionCard } from '@/entities/collection';
import { type Collection } from '@/entities/collection/model/types';
import { type Media } from '@/shared/types';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

const сollections: Collection[] = [
  {
    id: '1',
    slug: 'easter',
    title: 'easter',
    shortDescription: 'Furniture and decor for modern living spaces.',
    description:
      'Discover stylish sofas, coffee tables, storage solutions, and accessories for your living room.',
    media: {
      id: '1',
      type: 'image',
      src: '/images/collections/easter_2025.webp',
      alt: 'plate with  hares',
    } as Media,
  },
  {
    id: '2',
    slug: 'new-year',
    title: 'new year',
    shortDescription: 'Everything you need for a cozy bedroom.',
    description:
      'Browse beds, wardrobes, bedside tables, and bedroom decor in contemporary styles.',
    media: {
      id: '2',
      type: 'image',
      src: '/images/collections/new_year.webp',
      alt: 'plate with angels',
    } as Media,
  },
  {
    id: '3',
    slug: 'ptahy',
    title: 'Ptahy',
    shortDescription: 'Elegant dining furniture for every home.',
    description:
      'Explore dining tables, chairs, sideboards, and table accessories.',
    media: {
      id: '3',
      type: 'image',
      src: '/images/collections/ptahy.webp',
      alt: 'plate with birds',
    } as Media,
  },
  {
    id: '4',
    slug: 'easter',
    title: 'Easter',
    shortDescription: 'Comfortable and functional office furniture.',
    description:
      'Create a productive workspace with desks, office chairs, and storage solutions.',
    media: {
      id: '4',
      type: 'image',
      src: '/images/collections/easter_2025.webp',
      alt: 'plate with  hares',
    } as Media,
  },
  {
    id: '5',
    slug: 'new-year',
    title: 'New Year',
    shortDescription: 'Modern kitchen essentials.',
    description:
      'Find kitchen furniture, storage, and accessories for everyday cooking.',
    media: {
      id: '5',
      type: 'image',
      src: '/images/collections/new_year.webp',
      alt: 'plate with angels',
    } as Media,
  },
  {
    id: '6',
    slug: 'ptahy',
    title: 'Ptahy',
    shortDescription: 'Stylish bathroom furniture and storage.',
    description:
      'Organize your bathroom with cabinets, mirrors, and functional accessories.',
    media: {
      id: '6',
      type: 'image',
      src: '/images/collections/ptahy.webp',
      alt: 'plate with birds',
    } as Media,
  },
  {
    id: '7',
    slug: 'easter',
    title: 'Easter',
    shortDescription: 'Furniture for gardens and patios.',
    description:
      'Relax outdoors with durable tables, chairs, loungers, and decor.',
    media: {
      id: '7',
      type: 'image',
      src: '/images/collections/easter_2025.webp',
      alt: 'plate with hares',
    } as Media,
  },
  {
    id: '8',
    slug: 'new-year',
    title: 'New Year',
    shortDescription: 'Illuminate every room beautifully.',
    description:
      'Choose from pendant lights, floor lamps, table lamps, and wall lighting.',
    media: {
      id: '8',
      type: 'image',
      src: '/images/collections/new_year.webp',
      alt: 'plate with angels',
    } as Media,
  },
  {
    id: '9',
    slug: 'ptahy',
    title: 'Ptahy',
    shortDescription: 'Smart storage solutions.',
    description:
      'Keep your home organized with shelves, cabinets, baskets, and bookcases.',
    media: {
      id: '9',
      type: 'image',
      src: '/images/collections/ptahy.webp',
      alt: 'plate with birds',
    } as Media,
  },
];

export const CollectionsSection = () => {
  return (
    <Section className="fpt-4/6 fpb-10/30">
      <Container>
        <ul className="sm:fgapr-8/12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {сollections.map((collection: Collection) => (
            <li key={collection.id}>
              <CollectionCard collection={collection} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
