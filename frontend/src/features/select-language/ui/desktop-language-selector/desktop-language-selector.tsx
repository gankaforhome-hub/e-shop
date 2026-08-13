'use client';

import { useState } from 'react';

import { useLocale } from 'next-intl';

import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface DesktopLanguageSelectorProps {
  languages: ILanguageOption[];
  title?: string;
  subtitle?: string;
}

export function DesktopLanguageSelector({
  languages,
  title,
  subtitle,
}: DesktopLanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentLang = useLocale() as Locale;

  const activeLabel = languages.find(
    opt => opt.code === currentLang,
  )?.codeLabel;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          aria-label={subtitle}
        >
          <Icon
            name="language"
            iconPosition="left"
            className="size-6"
            classNameContainer="text-lg gap-1 font-normal"
            aria-hidden="true"
          >
            {activeLabel && activeLabel.toUpperCase()}
          </Icon>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        alignOffset={-4}
        className="bg-background w-80 p-6 shadow-lg backdrop-blur-md max-lg:hidden"
      >
        <LanguageSwitcher
          variant="desktop"
          title={title}
          subtitle={subtitle}
          languages={languages}
          onSelect={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
