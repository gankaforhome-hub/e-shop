import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { ResetPasswordForm } from '@/features/auth';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword');

  return { title: await getPageTitle(t('title')) };
}

/** Landing of the reset email (`#token=` in the fragment). */
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
