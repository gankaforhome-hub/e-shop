import Link, { type LinkProps } from 'next/link';
import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';

import { type AppRoutes, type ExternalHref } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

type AnchorProps = ComponentPropsWithoutRef<'a'>;
type NextLinkProps = Omit<LinkProps, 'href'>;

export type AppLinkProps = Omit<AnchorProps, 'href'> &
  NextLinkProps & {
    href: AppRoutes | ExternalHref;
    children: ReactNode;
    ref?: Ref<HTMLAnchorElement>;
  };

export function AppLink({
  href,
  className,
  children,
  ref,
  ...props
}: AppLinkProps) {
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
    <Link
      ref={ref}
      href={href}
      className={cn('duration-250 outline-0 transition-all', classNames)}
      {...props}
    >
      {children}
    </Link>
  );
}
