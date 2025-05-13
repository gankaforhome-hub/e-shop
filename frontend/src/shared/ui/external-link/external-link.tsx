import { AnchorHTMLAttributes, FC, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface IExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: ReactNode;
}

export const ExternalLink: FC<IExternalLinkProps> = ({
  className,
  href,
  children,
  ...props
}) => {
  //check whether the protocol specified
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
};
