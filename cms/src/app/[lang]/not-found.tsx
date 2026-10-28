import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { NotFoundView } from '@/widgets/not-found';

// not-found.tsx receives no props; the locale comes from the `[lang]` root param
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound');

  return { title: await getPageTitle(t('title')) };
}

export default function NotFound() {
  return <NotFoundView />;
}
