import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '@/features/auth';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.signUp');

  return { title: await getPageTitle(t('title')) };
}

export default function RegisterPage() {
  return <SignUpForm showDevHint={process.env.NODE_ENV === 'development'} />;
}
