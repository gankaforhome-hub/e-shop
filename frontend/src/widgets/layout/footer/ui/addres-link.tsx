import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface IAddressLinkProps {
  links: NavItem[];
  className?: string;
}

export function IAddressLink({ links, className = '' }: IAddressLinkProps) {
  return (
    <address className={cn('not-italic', className)}>
      <ul className="mt-auto space-y-2">
        {links.map(item => (
          <li key={item.href} className="text-left text-base">
            <AppLink href={item.href} className="group">
              <Icon
                name={item.icon}
                className="group-hover:text-icon-hover h-5 w-5 shrink-0"
                aria-hidden="true"
                iconPosition="left"
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
