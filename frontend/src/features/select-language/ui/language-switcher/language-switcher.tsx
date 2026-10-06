'use client';
import { useSearchParams } from 'next/navigation';

import { useLocale } from 'next-intl';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

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
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const href = queryString ? `${pathname}?${queryString}` : pathname;

  const isDesktop = variant === 'desktop';

  return (
    <div className={cn('flex flex-col', className)}>
      {isDesktop && (title || subtitle) && (
        <div className="border-brand mb-4 flex flex-col gap-1 border-b-2 pb-2">
          {title && (
            <Heading
              headingLevel="h3"
              variant="none"
              className="text-2xl tracking-tight"
            >
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text
              size="none"
              className="text-foreground/80 text-xs leading-relaxed"
            >
              {subtitle}
            </Text>
          )}
        </div>
      )}

      <ul className="divide-border/40 flex flex-col divide-y">
        {languages.map(({ code, codeTitle, ariaLabel }) => {
          const isActive = code === currentLang;
          return (
            <li key={code}>
              <AppLink
                href={href as AppRoutes}
                scroll={false}
                locale={code}
                hrefLang={code}
                onClick={onSelect}
                aria-current={isActive ? 'page' : undefined}
                aria-label={ariaLabel}
                className={cn(
                  'flex items-center justify-between py-3.5 text-sm tracking-wide transition-colors',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground hover:text-secondary-foreground font-normal',
                )}
              >
                <span>{codeTitle}</span>
                {isActive && (
                  <Icon
                    name="check"
                    className="size-4 stroke-[2.5]"
                    aria-hidden="true"
                  />
                )}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
