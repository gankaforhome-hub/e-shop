import { SocialLink } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { FC } from 'react';

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
              <AppLink href={link.href} aria-label={link.label} className="">
                <Icon name={link.icon} className="h-5 w-5" aria-hidden="true" />
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
