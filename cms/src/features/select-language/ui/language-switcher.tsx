'use client';

import { useLocale, useTranslations } from 'next-intl';

import { isValidLocale } from '@/shared/i18n/is-valid-locale';
import { locales } from '@/shared/i18n/routing';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Icon } from '@/shared/ui/icon';
import { Segmented, segmentedItemVariants } from '@/shared/ui/segmented';
import { Text } from '@/shared/ui/text';

import { useSwitchLocale } from '../model/use-switch-locale';

/** Desktop header: current locale code, full names in the menu. */
export function LanguageMenu() {
  const t = useTranslations('language');
  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-1.5 px-2.5"
          aria-label={t('current', { language: t(`names.${locale}`) })}
        >
          <Icon name="language" className="size-[1.125rem]" />
          <Text as="span" size="eyebrow" variant="inherit">
            {t(`codes.${locale}`)}
          </Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>
          <Text as="span" size="xs" variant="muted">
            {t('label')}
          </Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Mounted only while open: reads the pathname on the client */}
        <LanguageOptions />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageOptions() {
  const t = useTranslations('language');
  const { locale, switchLocale } = useSwitchLocale();

  return (
    <DropdownMenuRadioGroup
      value={locale}
      onValueChange={value => {
        if (isValidLocale(value)) {
          switchLocale(value);
        }
      }}
    >
      {locales.map(code => (
        <DropdownMenuRadioItem key={code} value={code} lang={code}>
          {t(`names.${code}`)}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}

/** Mobile menu: both languages side by side. */
export function LanguageSegmented() {
  const t = useTranslations('language');
  const { locale, switchLocale } = useSwitchLocale();

  return (
    <Segmented aria-label={t('label')}>
      {locales.map(code => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === locale}
          onClick={() => switchLocale(code)}
          className={segmentedItemVariants({ active: code === locale })}
        >
          {t(`names.${code}`)}
        </button>
      ))}
    </Segmented>
  );
}
