'use client';

import { useState, useTransition } from 'react';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/shared/i18n/navigation';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import { LanguageMenu } from './language-menu';

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
  const [isPending, startTransition] = useTransition();

  const currentLang = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectLanguage = (nextLocale: Locale) => {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const activeLabel =
    languages.find(l => l.code === currentLang)?.code.toUpperCase() ??
    currentLang.toUpperCase();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="hidden max-lg:hidden lg:flex"
          aria-label="Select Language"
        >
          <Icon
            name="language"
            iconPosition="left"
            className="size-6"
            childClassName="text-lg gap-1 font-normal"
          >
            {activeLabel}
          </Icon>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        alignOffset={-4}
        className="border-border/50 w-80 rounded-xl p-6 shadow-xl"
      >
        <LanguageMenu
          variant="desktop"
          title={title}
          subtitle={subtitle}
          languages={languages}
          currentLang={currentLang}
          onSelectLanguage={handleSelectLanguage}
        />
      </PopoverContent>
    </Popover>
  );
}
