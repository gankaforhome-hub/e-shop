import { type Metadata } from 'next';

import { getLocale, getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/entities/user/server';
import { SecurityKeyStep } from '@/features/auth';
import { routes } from '@/shared/config';
import { getPageTitle } from '@/shared/i18n/get-section-metadata';
import { redirect } from '@/shared/i18n/navigation';

// Reads the session: blocks instead of streaming
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.securityKey');

  return { title: await getPageTitle(t('confirm.title')) };
}

/** Key step after the password (root: add a key first; with a key: confirm); the CMS shell sends them here. */
export default async function SecurityKeyPage() {
  const { keyStep } = await getCurrentUser();
  if (!keyStep) {
    return redirect({ href: routes.home, locale: await getLocale() });
  }

  // A new step starts with a fresh state (code, the shown key id, errors)
  return <SecurityKeyStep key={keyStep} step={keyStep} />;
}
