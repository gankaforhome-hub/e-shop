import { type FC } from 'react';

import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';

import { type FooterLink } from '../api';

interface IFooterLinkColumn {
  heading: string;
  links: FooterLink[];
  className?: string;
}

export const FooterLinkColumn: FC<IFooterLinkColumn> = ({
  heading,
  links,
  className = '',
}) => {
  return (
    <div className={className}>
      <Heading headingLevel="h3" variant="footer" tone="accent">
        {heading}
      </Heading>
      <ul className="mt-4 space-y-4">
        {links.map(link => (
          <li key={link.href}>
            <AppLink
              href={link.href}
              className="text-fg-primary text-base first-letter:uppercase xl:text-xl"
            >
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
