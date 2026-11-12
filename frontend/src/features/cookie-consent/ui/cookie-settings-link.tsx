'use client';

import { useTranslations } from 'next-intl';

import { openConsentSettings } from '@/shared/lib/consent';
import { Button } from '@/shared/ui/button';

/** Footer entry that reopens the cookie settings at any time. */
export function CookieSettingsLink() {
  const t = useTranslations('common.cookieConsent');

  return (
    <Button
      variant="link"
      className="h-auto p-0 font-normal text-inherit"
      onClick={openConsentSettings}
    >
      {t('footerLink')}
    </Button>
  );
}
