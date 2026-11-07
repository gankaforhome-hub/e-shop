import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { VerifyEmailForm } from '@/features/auth';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.verifyEmail');

  return { title: await getPageTitle(t('title')) };
}

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
