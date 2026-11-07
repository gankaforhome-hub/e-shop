import { type Metadata } from 'next';

import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { CmsOverview } from '@/widgets/cms-overview';

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('overview.home');
}

export default function OverviewPage() {
  return <CmsOverview />;
}
