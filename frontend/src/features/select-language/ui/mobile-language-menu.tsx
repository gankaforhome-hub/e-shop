'use client';

import { useState, useTransition } from 'react';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/shared/i18n/navigation';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';

import { LanguageMenu } from './language-menu';

interface MobileMenuProps {
  languages: ILanguageOption[];
  title?: string;
  subtitle?: string;
}

export function MobileLangMenu({
  languages,
  title,
  subtitle,
}: MobileMenuProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [, startTransition] = useTransition();

  const currentLang = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectLanguage = (nextLocale: Locale) => {
    setIsLangOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div>
      {isLangOpen && (
        <div className="p-4">
          <LanguageMenu
            variant="mobile"
            title={title}
            subtitle={subtitle}
            languages={languages}
            currentLang={currentLang}
            onSelectLanguage={handleSelectLanguage}
          />
        </div>
      )}
    </div>
  );
}
