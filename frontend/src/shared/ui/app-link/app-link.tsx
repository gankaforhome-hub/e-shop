import { type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react';

import { cva } from 'class-variance-authority';

import { type AppRoutes, type ExternalHref } from '@/shared/config';
import { Link } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';

type AnchorProps = ComponentPropsWithoutRef<'a'>;
type I18nLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>;

const EXTERNAL_HREF = /^(https?:\/\/|mailto:|tel:)/;
const NEW_TAB_HREF = /^https?:\/\//;

export const appLinkVariants = cva(
  'duration-(--dur-normal) focus-visible:ring-ring group inline-flex shrink-0 outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-2',
);

export type AppLinkProps = Omit<AnchorProps, 'href'> &
  I18nLinkProps & {
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
  const classNames = cn(appLinkVariants({ className }));

  if (EXTERNAL_HREF.test(href)) {
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
