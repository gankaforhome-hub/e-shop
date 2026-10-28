'use client';

import { useTranslations } from 'next-intl';

import { setTheme, THEMES, toggleTheme, useTheme } from '@/shared/lib/theme';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Segmented, segmentedItemVariants } from '@/shared/ui/segmented';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

const THEME_ICONS = { light: 'sun', dark: 'moon' } as const;

/** Desktop header: one click flips light ↔ dark. */
export function ThemeToggle() {
  const t = useTranslations('theme');
  const theme = useTheme();

  const label =
    theme === null
      ? t('toggle')
      : theme === 'dark'
        ? t('switchToLight')
        : t('switchToDark');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={toggleTheme}
        >
          {/* Swapped by CSS, so the right icon shows before hydration */}
          <Icon name="sun" className="size-[1.125rem] dark:hidden" />
          <Icon name="moon" className="hidden size-[1.125rem] dark:block" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

/** Mobile menu: both themes side by side. */
export function ThemeSegmented() {
  const t = useTranslations('theme');
  const theme = useTheme();

  return (
    <Segmented aria-label={t('label')}>
      {THEMES.map(option => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => setTheme(option)}
          className={segmentedItemVariants({ active: theme === option })}
        >
          <Icon name={THEME_ICONS[option]} />
          {t(option)}
        </button>
      ))}
    </Segmented>
  );
}
