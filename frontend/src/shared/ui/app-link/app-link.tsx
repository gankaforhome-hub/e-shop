import { Slot } from '@radix-ui/react-slot';
import Link from 'next/link';
import {
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  ReactNode,
} from 'react';

import { AppRoutes, ExternalHref } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

interface IAppLinkProps extends ComponentPropsWithoutRef<'a'> {
  href: AppRoutes | ExternalHref;
  asChild?: boolean;
  className?: string;
  children: ReactNode;
}

export const AppLink = forwardRef<HTMLAnchorElement, IAppLinkProps>(
  ({ href, asChild = false, className, children, ...props }, ref) => {
    const isHttp = /^https?:\/\//.test(href);
    const isMailOrTel = /^(mailto:|tel:)/.test(href);
    const isExternal = isHttp || isMailOrTel;

    const Comp: ElementType = asChild ? Slot : isExternal ? 'a' : Link;

    // Runtime validation
    if (process.env.NODE_ENV !== 'production') {
      if (typeof href === 'string' && !href.startsWith('/') && !isExternal) {
        console.warn(
          `[AppLink] Incorrect href: "${href}". The way is expected, http(s), mailto: or tel:`,
        );
      }
    }

    return (
      <Comp
        href={href}
        ref={ref}
        className={cn('flex shrink-0', className)}
        {...(isHttp && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

AppLink.displayName = 'AppLink';
