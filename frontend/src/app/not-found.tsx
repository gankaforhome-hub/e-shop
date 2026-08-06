import { redirect } from 'next/navigation';

import { defaultLocale } from '@/shared/i18n/routing';

export default function GlobalNotFound() {
  redirect(`/${defaultLocale}/not-found`);
}
