'use client';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';

import { isActiveRoute } from '../lib';

export interface INavItemProps {
  variant: 'header' | 'footer' | 'mobile' | 'popover' | undefined;
  href?: AppRoutes;
  label: string;
  description?: string;
  className?: string;
  showActive?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

export function NavItem({
  variant = 'header',
  href,
  label,
  description,
  className,
  showActive = true,
  hasSubmenu = false,
  onClick,
}: INavItemProps) {
  const pathname = usePathname();
  const isActive =
    showActive && Boolean(href) && isActiveRoute(pathname, href!);

  const navLinkStyle = {
    // header: 'relative link-hover focus:[--start:0%] hover:[--start:0%] py-2',
    header: 'relative link py-2',

    footer: 'text-base first-letter:uppercase link',
    mobile:
      'flex items-center justify-between text-base py-4 w-full select-none text-left transition-all active:opacity-70 text-foreground hover:bg-muted/60 px-4',
    popover:
      'hover:text-foreground/70 text-foreground duration-(--dur-fast) block rounded-md py-1 text-base transition-colors',
  };

  const activeStyle = {
    header:
      'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary',
    footer: 'font-semibold text-primary underline underline-offset-4',
    mobile: 'text-accent-foreground font-medium  rounded-xs',
    popover: 'text-accent-foreground font-medium  rounded-xs',
  };

  const sharedClasses = cn(
    navLinkStyle[variant],
    isActive && activeStyle[variant],
    className,
  );

  const content = (
    <>
      {description ? (
        <div className="flex flex-col">
          <span>{label}</span>
          <span className="text-muted-foreground text-xs font-normal">
            {description}
          </span>
        </div>
      ) : (
        <>{label}</>
      )}

      {hasSubmenu && variant === 'mobile' && (
        <Icon name="chevron-right" className="ml-2 h-5 w-5 shrink-0" />
      )}
    </>
  );

  if (hasSubmenu || !href) {
    return (
      <button type="button" onClick={onClick} className={sharedClasses}>
        {content}
      </button>
    );
  }

  return (
    <AppLink href={href} onClick={onClick} className={sharedClasses}>
      <span>{content}</span>
    </AppLink>
  );
}
