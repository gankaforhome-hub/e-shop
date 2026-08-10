import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';

interface ISocialLinksProps {
  heading: string;
  links: NavItem[];
  className?: string;
}

export function SocialLinks({
  heading,
  links,
  className = '',
}: ISocialLinksProps) {
  return (
    <div className={className}>
      <Heading headingLevel="h3" variant="footer" tone="accent">
        {heading}
      </Heading>
      <ul className="mt-4 flex items-center space-x-4">
        {links.map(link => {
          return (
            <li key={link.href}>
              <Button variant="iconPrimary" size="icon" asChild>
                <AppLink
                  href={link.href}
                  aria-label={link.label}
                  className="h-8 w-8 rounded-full"
                >
                  <Icon
                    name={link.icon}
                    className="h-5 w-5 fill-none"
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
}
