import { cn } from '@/shared/lib/utils';
import { type SocialLink } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

interface ISocialMenuProps {
  className?: string;
  socialLink: SocialLink[];
  closeMenu?: () => void;
}

export function SocialMenu({
  className,
  socialLink,
  closeMenu,
}: ISocialMenuProps) {
  return (
    <ul className={cn('w-full', className)}>
      {socialLink.map(social => (
        <li
          key={social.href}
          className={cn(
            'border-muted group border-b py-4 first:pt-0 last:border-0 last:pb-0',
            'hover:border-accent custom-transition transition-colors',
          )}
        >
          <AppLink
            href={social.href}
            className="flex items-center"
            onClick={() => closeMenu?.()}
          >
            <Icon
              name={social.icon}
              className="-order-1 h-5 w-5"
              classNameContainer="text-base gap-4 group-hover:text-icon"
            >
              {social.label}
            </Icon>
          </AppLink>
        </li>
      ))}
    </ul>
  );
}
