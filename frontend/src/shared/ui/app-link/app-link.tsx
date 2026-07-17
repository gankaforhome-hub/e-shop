import Link, { type LinkProps } from 'next/link';
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';

import { type AppRoutes, type ExternalHref } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

type AppLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> &
  Omit<LinkProps, 'href'> & {
    href: AppRoutes | ExternalHref;
    children: ReactNode;
  };

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    const classNames = cn('group inline-flex shrink-0', className);

    const isExternalLink = /^(https?:\/\/|mailto:|tel:)/.test(href);
    const shouldOpenNewTab = /^https?:\/\//.test(href);

    if (isExternalLink) {
      return (
        <a
          ref={ref}
          href={href}
          className={classNames}
          {...(shouldOpenNewTab && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={classNames} {...props}>
        {children}
      </Link>
    );
  },
);

AppLink.displayName = 'AppLink';
