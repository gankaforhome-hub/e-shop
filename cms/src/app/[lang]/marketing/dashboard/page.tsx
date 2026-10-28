import { type Metadata } from 'next';

import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { SectionOverview } from '@/widgets/section-overview';

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('marketing.dashboard');
}

export default function DashboardPage() {
  return <SectionOverview section="marketing.dashboard" />;
}
