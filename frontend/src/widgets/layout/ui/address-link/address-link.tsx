import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

export interface IAddressLinkProps {
  links: NavItem[];
  className?: string;
  variant: 'footer' | 'mobileMenu';
  onItemClick?: () => void;
}
export function AddressLink({
  links,
  variant,
  className,
  onItemClick,
}: IAddressLinkProps) {
  if (!links.length) {
    return null;
  }

  const styles = {
    footer: {
      list: 'space-y-2',
      link: 'text-foreground hover:text-foreground-emphasis text-base',
    },
    mobileMenu: {
      list: 'space-y-4',
      link: 'text-secondary-foreground hover:text-foreground-emphasis text-sm',
    },
  };

  return (
    <address className={cn('not-italic', className)}>
      <ul className={cn('font-caption flex flex-col', styles[variant].list)}>
        {links.map(item => (
          <li key={item.href} className="text-left">
            <AppLink
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'duration-(--dur-normal) group flex items-center transition-colors',
                styles[variant].link,
              )}
            >
              <Icon
                name={item.icon}
                iconPosition="left"
                className="group-hover:text-icon-hover duration-(--dur-normal) size-4 transition-colors"
                aria-hidden="true"
                classNameContainer="overflow-hidden text-ellipsis"
              >
                {item.label}
              </Icon>
            </AppLink>
          </li>
        ))}
      </ul>
    </address>
  );
}
