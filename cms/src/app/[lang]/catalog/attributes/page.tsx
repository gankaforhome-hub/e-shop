import { type Metadata } from 'next';

import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { SectionOverview } from '@/widgets/section-overview';

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('catalog.attributes');
}

export default function AttributesPage() {
  return <SectionOverview section="catalog.attributes" />;
}
