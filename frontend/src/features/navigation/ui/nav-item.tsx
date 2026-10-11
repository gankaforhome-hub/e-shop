'use client';

import { memo, type ComponentPropsWithRef, type ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { isActiveRoute } from '../lib';

const navItemVariants = cva('font-heading', {
  variants: {
    variant: {
      header: 'link text-xl capitalize',
      footer: 'link text-base capitalize',
      mobile:
        'text-foreground hover:bg-muted/60 flex w-full select-none items-center justify-between px-4 py-4 text-left text-base transition-all active:opacity-70',
      popover:
        'hover:text-secondary-foreground text-foreground duration-(--dur-normal) py-1 text-base transition-colors',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'header', active: true, className: 'text-foreground' },
    {
      variant: ['mobile', 'popover'],
      active: true,
      className: 'text-foreground rounded-xs font-medium',
    },
  ],
  defaultVariants: {
    variant: 'header',
    active: false,
  },
});

export interface NavItemProps
  extends
    Omit<ComponentPropsWithRef<'button'>, 'children'>,
    Pick<VariantProps<typeof navItemVariants>, 'variant'> {
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
}: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    showActive && href !== undefined && isActiveRoute(pathname, href);

  const sharedClasses = cn(
    navItemVariants({ variant, active: isActive, className }),
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
        className={cn('rounded-none', sharedClasses)}
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
