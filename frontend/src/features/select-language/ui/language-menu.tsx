import { type ILanguageOption, type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';

interface LanguageMenuProps {
  languages: ILanguageOption[];
  currentLang: Locale;
  onSelectLanguage: (code: Locale) => void;
  variant?: 'mobile' | 'desktop';
  title?: string;
  subtitle?: string;
  className?: string;
}

export function LanguageMenu({
  languages,
  currentLang,
  onSelectLanguage,
  variant = 'mobile',
  title,
  subtitle,
  className,
}: LanguageMenuProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {variant === 'desktop' && (title || subtitle) && (
        <div className="mb-4 flex flex-col gap-1">
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
          <div className="bg-brand mt-2 h-0.5 w-full" />
        </div>
      )}

      <div className="flex flex-col">
        {languages.map(lang => {
          const isActive = lang.code === currentLang;

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={cn(
                'border-border/40 flex w-full items-center justify-between border-b py-3.5 text-left transition-colors',
                isActive
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/80 hover:text-foreground font-normal',
              )}
            >
              <span className="text-sm tracking-wide">{lang.label}</span>
              {isActive && (
                <Icon name="check" className="size-4 stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
