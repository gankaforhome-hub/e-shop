'use client';

import { useEffect, useId, useState } from 'react';

import { useTranslations } from 'next-intl';

import { routes } from '@/shared/config/routes';
import {
  saveConsent,
  subscribeToConsentSettings,
  useConsent,
  type ConsentCategory,
  type CookieConsent,
} from '@/shared/lib/consent';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Text } from '@/shared/ui/text';

const CATEGORIES: ConsentCategory[] = ['analytics', 'marketing'];
const NONE: CookieConsent = { analytics: false, marketing: false };
const ALL: CookieConsent = { analytics: true, marketing: true };

/**
 * Shown until the visitor chooses. Nothing renders on the server or before hydration, so the
 * static shell has no banner and no layout shift. "Settings" and the footer link open the panel.
 */
export function CookieBanner() {
  const t = useTranslations('common.cookieConsent');
  const id = useId();
  const consent = useConsent();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<CookieConsent>(NONE);

  const openSettings = () => {
    setDraft(consent ?? NONE);
    setIsSettingsOpen(true);
  };

  // External trigger: the footer "Cookie settings" link (a window event)
  useEffect(() => subscribeToConsentSettings(openSettings));

  const choose = (choice: CookieConsent) => {
    saveConsent(choice);
    setIsSettingsOpen(false);
  };

  return (
    <>
      {consent === null ? (
        <div
          role="region"
          aria-label={t('settingsTitle')}
          className="bg-background border-border fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-md border p-4 shadow-lg md:flex-row md:items-center"
        >
          <Text size="small" className="flex-1">
            {t('text')}{' '}
            <AppLink
              href={routes.info('privacy-policy')}
              className="underline underline-offset-2"
            >
              {t('privacy')}
            </AppLink>
          </Text>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={openSettings}>
              {t('settings')}
            </Button>
            <Button variant="outline" onClick={() => choose(NONE)}>
              {t('necessaryOnly')}
            </Button>
            <Button onClick={() => choose(ALL)}>{t('acceptAll')}</Button>
          </div>
        </div>
      ) : null}

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-2xl">
          <SheetHeader className="flex flex-col gap-1 p-5">
            <SheetTitle>{t('settingsTitle')}</SheetTitle>
            <SheetDescription>{t('settingsDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-5 pb-5">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`${id}-necessary`}
                checked
                disabled
                className="mt-0.5"
              />
              <label
                htmlFor={`${id}-necessary`}
                className="flex flex-col gap-0.5"
              >
                <Text as="span" size="small">
                  {t('necessary.title')}
                </Text>
                <Text as="span" size="small" variant="muted">
                  {t('necessary.description')}
                </Text>
              </label>
            </div>
            {CATEGORIES.map(category => (
              <div key={category} className="flex items-start gap-3">
                <Checkbox
                  id={`${id}-${category}`}
                  checked={draft[category]}
                  onCheckedChange={checked =>
                    setDraft(current => ({
                      ...current,
                      [category]: checked === true,
                    }))
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor={`${id}-${category}`}
                  className="flex cursor-pointer flex-col gap-0.5"
                >
                  <Text as="span" size="small">
                    {t(`${category}.title`)}
                  </Text>
                  <Text as="span" size="small" variant="muted">
                    {t(`${category}.description`)}
                  </Text>
                </label>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => choose(draft)}>{t('save')}</Button>
              <Button variant="outline" onClick={() => choose(ALL)}>
                {t('acceptAll')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
