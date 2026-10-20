import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';

export interface ISocialLinksProps {
  links: NavItem[];
  heading?: string;
  className?: string;
  variant?: 'footer' | 'mobileMenu' | 'contactUsForm';
  onItemClick?: () => void;
}
export function SocialLinks({
  heading,
  links,
  className,
  variant = 'footer',
  onItemClick,
}: ISocialLinksProps) {
  if (!links?.length) {
    return null;
  }

  const isMobileMenu = variant === 'mobileMenu';

  const styles = {
    contactUsForm: {
      list: 'gap-3',
      link: 'flex h-12 w-16 items-center justify-center rounded-lg border border-brand/80 bg-background transition hover:border-brand',
      icon: 'text-icon size-5',
      label: 'sr-only',
    },
    footer: {
      list: 'mt-4 gap-4',
      link: 'size-8 justify-center rounded-full bg-background/20 shadow-lg',
      icon: 'text-icon size-5',
      label: 'sr-only',
    },
    mobileMenu: {
      list: 'gap-2 max-[300px]:flex-col',
      link: 'text-secondary-foreground border-brand justify-between rounded-sm border px-3 py-2',
      icon: 'size-3.5',
      label: '',
    },
  };

  return (
    <div className={className}>
      {heading && (
        <Heading headingLevel="h2" variant="footer" tone="accent">
          {heading}
        </Heading>
      )}

      <ul
        className={cn('font-caption flex items-center', styles[variant].list)}
      >
        {links.map(soc => (
          <li key={soc.href} className={cn(isMobileMenu && 'group')}>
            <AppLink
              href={soc.href}
              onClick={onItemClick}
              className={cn(
                'group flex items-center gap-1',
                'hover:text-foreground-emphasis duration-(--dur-normal) transition-all',
                styles[variant].link,
              )}
            >
              <Icon
                iconPosition="left"
                name={soc.icon}
                className={cn(
                  'fill-none',
                  'group-hover:text-icon-hover duration-(--dur-normal) transition-colors',
                  styles[variant].icon,
                )}
                classNameContainer={cn('text-sm tracking-wider')}
                aria-hidden="true"
              >
                <span className={cn(styles[variant].label)}>{soc.label}</span>
              </Icon>
              {isMobileMenu && (
                <Icon
                  name="arrow-up-right"
                  className="group-hover:text-brand duration-(--dur-slow) size-3 transition-all group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              )}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
