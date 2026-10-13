'use client';

import {
  memo,
  Suspense,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { type AppRoutes } from '@/shared/config';
import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { isActiveRoute } from '../lib';

const navItemVariants = cva('', {
  variants: {
    variant: {
      header: 'font-heading link text-xl',
      footer: 'font-heading link text-base',
      mobile:
        'font-heading text-foreground hover:bg-muted/60 flex w-full select-none items-center justify-between px-4 py-4 text-left text-base transition-all active:opacity-70',
      popover:
        'font-heading hover:text-secondary-foreground text-foreground duration-(--dur-normal) py-1 text-base transition-colors',
      /** Info pages desktop sidebar. */
      sidebar:
        'text-muted-foreground hover:text-foreground duration-(--dur-normal) shrink-0 whitespace-nowrap text-xs uppercase tracking-widest transition-colors md:text-sm',
      /** Info pages mobile dropdown: full-width rows, 48px touch targets. */
      dropdown:
        'text-muted-foreground hover:bg-muted/30 hover:text-foreground active:bg-muted/50 duration-(--dur-normal) flex min-h-12 w-full touch-manipulation items-center justify-between gap-4 px-4 text-sm uppercase tracking-widest transition-colors',
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
    {
      variant: 'sidebar',
      active: true,
      className: 'text-foreground font-medium underline underline-offset-4',
    },
    {
      variant: 'dropdown',
      active: true,
      className: 'bg-muted/50 text-foreground font-medium',
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

/**
 * The active state reads `usePathname()`, which suspends while prerendering
 * a route's fallback shell (Cache Components). Each item gets its own
 * boundary whose fallback is the same item, inactive, so the shell keeps every
 * link and there is no layout shift once the pathname resolves.
 */
export const NavItem = memo(function NavItem(props: NavItemProps) {
  const { showActive = true, href } = props;

  if (!showActive || href === undefined) {
    return <NavItemView {...props} isActive={false} />;
  }

  return (
    <Suspense fallback={<NavItemView {...props} isActive={false} />}>
      <ActiveNavItem {...props} href={href} />
    </Suspense>
  );
});

function ActiveNavItem(props: NavItemProps & { href: AppRoutes }) {
  const pathname = usePathname();
  return (
    <NavItemView {...props} isActive={isActiveRoute(pathname, props.href)} />
  );
}

function NavItemView({
  variant = 'header',
  href,
  label,
  description,
  className,
  showActive: _showActive,
  hasSubmenu = false,
  btnSubmenuChildren,
  onClick,
  ref,
  isActive,
  ...buttonProps
}: NavItemProps & { isActive: boolean }) {
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
    <AppLink
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={sharedClasses}
    >
      <span>{content}</span>
      {isActive && variant === 'dropdown' && (
        <Icon
          name="check"
          aria-hidden
          className="text-action-primary size-4 shrink-0"
        />
      )}
    </AppLink>
  );
}
