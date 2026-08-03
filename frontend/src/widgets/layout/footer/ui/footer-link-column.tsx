import { type INavItemConfig, NavItem } from '@/features/navigation';
import { Heading } from '@/shared/ui/heading';

interface IFooterLinkColumnProps {
  heading: string;
  links: INavItemConfig[];
  className?: string;
}

export function FooterLinkColumn({
  heading,
  links,
  className = '',
}: IFooterLinkColumnProps) {
  return (
    <nav className={className}>
      <Heading headingLevel="h3" variant="footer" tone="accent">
        {heading}
      </Heading>
      <ul className="mt-4 space-y-4">
        {links.map(link => (
          <li key={link.href}>
            <NavItem
              variant="footer"
              href={link.href}
              label={link.labelKey}
              showActive={false}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
