import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';

import { cva } from 'class-variance-authority';

import {
  type AppRoutes,
  type ExternalHref,
  type HashHref,
} from '@/shared/config';
import { Link } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';

// Rendered as a plain <a>: external pages, mail/phone and in-page anchors
const NATIVE_HREF = /^(https?:\/\/|mailto:|tel:|#)/;
const NEW_TAB_HREF = /^https?:\/\//;

export const appLinkVariants = cva(
  'outline-none focus-visible:ring-2 focus-visible:ring-ring',
);

export type AppLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: AppRoutes | ExternalHref | HashHref;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
};

/** The only link primitive: typed `href`, locale prefix for in-app routes. */
export function AppLink({
  href,
  className,
  children,
  ref,
  ...props
}: AppLinkProps) {
  const classNames = cn(appLinkVariants({ className }));

  if (NATIVE_HREF.test(href)) {
    return (
      <a
        ref={ref}
        href={href}
        className={classNames}
        {...(NEW_TAB_HREF.test(href) && {
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
}
