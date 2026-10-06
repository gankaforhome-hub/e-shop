'use client';

import { memo, type ComponentPropsWithRef, type ReactNode } from 'react';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { isActiveRoute } from '../lib';

export interface INavItemProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children'
> {
  variant: 'header' | 'footer' | 'mobile' | 'popover' | undefined;
  href?: AppRoutes;
  label: string;
  description?: string;
  className?: string;
  showActive?: boolean;
  hasSubmenu?: boolean;
  btnSubmenuChildren?: ReactNode;
  onClick?: () => void;
}

export const NavItem = memo(function NavItem({
  variant = 'header',
  href,
  label,
  description,
  className,
  showActive = true,
  hasSubmenu = false,
  btnSubmenuChildren,
  onClick,
  ref,
  ...buttonProps
}: INavItemProps) {
  const pathname = usePathname();
  const isActive =
    showActive && Boolean(href) && isActiveRoute(pathname, href!);

  const navLinkStyle = {
    header: 'text-xl capitalize link',
    footer: 'text-base capitalize link',
    mobile:
      'flex items-center justify-between text-base py-4 w-full select-none text-left transition-all active:opacity-70 text-foreground hover:bg-muted/60 px-4',
    popover:
      'hover:text-secondary-foreground text-foreground duration-(--dur-norm) py-1 text-base transition-colors',
  };

  const activeStyle = {
    header: 'text-foreground',
    footer: '',
    mobile: 'text-foreground font-medium rounded-xs',
    popover: 'text-foreground font-medium rounded-xs',
  };

  const sharedClasses = cn(
    'font-heading',
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
        <Icon name="chevron-right" className="h-5 w-5 shrink-0" />
      )}
    </>
  );

  if (hasSubmenu || !href) {
    return (
      <Button
        variant="ghost"
        size="full"
        ref={ref}
        {...buttonProps}
        onClick={onClick}
        className={cn('font-text rounded-none', sharedClasses)}
      >
        {content}
        {btnSubmenuChildren}
      </Button>
    );
  }

  return (
    <AppLink href={href} onClick={onClick} className={sharedClasses}>
      <span>{content}</span>
    </AppLink>
  );
});
