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
    const isExternal = /^https?:\/\//.test(href);

    const Comp: ElementType = asChild ? Slot : isExternal ? 'a' : Link;

    const formattedHref = isExternal
      ? href.startsWith('http')
        ? href
        : `https://${href}`
      : href;

    return (
      <Comp
        href={formattedHref}
        ref={ref}
        className={cn(className, 'flex shrink-0')}
        {...(isExternal && {
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
