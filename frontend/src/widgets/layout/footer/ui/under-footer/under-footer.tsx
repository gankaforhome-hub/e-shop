import { CookieSettingsLink } from '@/features/cookie-consent';
import { NavItem, type INavItemConfig } from '@/features/navigation';
import { cn, getCurrentYear } from '@/shared/lib/utils';
import { Icon } from '@/shared/ui/icon';

interface IUnderFooterProps {
  legalLinks: INavItemConfig[];
  /** Accessible name of the legal links `nav`. */
  navLabel: string;
  className?: string;
}

export function UnderFooter({
  legalLinks,
  navLabel,
  className,
}: IUnderFooterProps) {
  return (
    <div
      className={cn(
        'border-border text-foreground/70 mt-4 flex flex-col items-center gap-4 border-t pt-4 text-sm lg:flex-row-reverse lg:justify-center',
        className,
      )}
    >
      <nav aria-label={navLabel}>
        <ul className="flex flex-wrap items-center justify-center gap-3 text-center md:gap-4">
          {legalLinks.map((link, index) => (
            <li
              key={link.href}
              className={cn(index === 2 && 'max-sm:basis-full')}
            >
              <NavItem
                variant="footer"
                href={link.href}
                label={link.label}
                showActive={false}
              />
            </li>
          ))}
          <li>
            <CookieSettingsLink />
          </li>
        </ul>
      </nav>
      {/* /85: 4.8:1 on the footer grey (the inherited /70 is 3.4:1) */}
      <p className="text-foreground/85">
        <Icon name="copyright" iconPosition="left" size={10}>
          2024 - {getCurrentYear} Ganka&Home
        </Icon>
      </p>
    </div>
  );
}
