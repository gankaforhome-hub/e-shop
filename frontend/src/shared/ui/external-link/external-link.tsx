import { type AnchorHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: ReactNode;
}

export function ExternalLink({
  className,
  href,
  children,
  ...props
}: IExternalLinkProps) {
  const isExternal = /^https?:\/\//.test(href);
  const formattedHref = isExternal ? href : `https://${href}`;

  return (
    <a
      href={formattedHref}
      className={cn(
        className,
        "relative flex shrink-0 items-center justify-center before:content-['']",
      )}
      target="_blank"
      rel="noopener noreferrer nofollow"
      {...props}
    >
      {children}
    </a>
  );
}
