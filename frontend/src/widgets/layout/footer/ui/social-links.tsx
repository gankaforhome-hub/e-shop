import { type FC } from 'react';

import { type SocialLink } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';

interface ISocialLinks {
  links: SocialLink[];
  className?: string;
}

export const SocialLinks: FC<ISocialLinks> = ({ links, className = '' }) => {
  return (
    <div className={className}>
      <Heading headingLevel="h3" variant="footer" tone="accent">
        Follow Us
      </Heading>
      <ul className="mt-4 flex items-center space-x-4">
        {links.map(link => {
          return (
            <li key={link.href}>
              <Button variant="ghost" asChild>
                <AppLink
                  href={link.href}
                  aria-label={link.label}
                  className="h-8 w-8 rounded-full"
                >
                  <Icon
                    name={link.icon}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </AppLink>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
