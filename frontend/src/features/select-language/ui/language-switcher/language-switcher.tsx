'use client';
import { useLocale } from 'next-intl';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface ILanguageSwitcherProps {
  languages: ILanguageOption[];
  variant?: 'mobile' | 'desktop';
  title?: string;
  subtitle?: string;
  className?: string;
  onSelect?: () => void;
}

export function LanguageSwitcher({
  languages,
  variant = 'mobile',
  title,
  subtitle,
  className,
  onSelect,
}: ILanguageSwitcherProps) {
  const currentLang = useLocale() as Locale;
  const pathname = usePathname();
  const isDesktop = variant === 'desktop';

  return (
    <div className={cn('flex flex-col', className)}>
      {isDesktop && (title || subtitle) && (
        <div className="border-brand mb-4 flex flex-col gap-1 border-b-2 pb-2">
          {title && (
            <h3 className="text-foreground font-serif text-2xl font-normal tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <ul className="divide-border/40 flex flex-col divide-y">
        {languages.map(({ code, codeTitle }) => {
          const isActive = code === currentLang;
          return (
            <li key={code}>
              <AppLink
                href={pathname as AppRoutes}
                scroll={false}
                locale={code}
                hrefLang={code}
                onClick={onSelect}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between py-3.5 text-sm tracking-wide transition-colors',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/80 hover:text-foreground font-normal',
                )}
              >
                <span>{codeTitle}</span>
                {isActive && (
                  <Icon name="check" className="size-4 stroke-[2.5]" />
                )}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
