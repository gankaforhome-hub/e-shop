import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { AcceptInviteForm } from '@/features/auth';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.acceptInvite');

  return { title: await getPageTitle(t('title')) };
}

export default function AcceptInvitePage() {
  return <AcceptInviteForm />;
}
