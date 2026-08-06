import { NavItem, type INavItemConfig } from '@/features/navigation';
import { cn, getCurrentYear } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Icon } from '@/shared/ui/icon';

interface IUnderFooterProps {
  legalLinks: INavItemConfig[];
  className?: string;
}

export function UnderFooter({ legalLinks, className }: IUnderFooterProps) {
  return (
    <Box
      className={cn(
        'border-border-muted/40 text-foreground/70 mt-4 flex flex-col items-center gap-4 border-t pt-4 text-sm lg:flex-row-reverse lg:justify-center',
        className,
      )}
    >
      <nav aria-label="Legal">
        <ul className="flex items-center justify-center gap-3 md:gap-4">
          {legalLinks.map(link => (
            <li key={link.href}>
              <NavItem
                variant="footer"
                href={link.href}
                label={link.label}
                showActive={false}
              />
            </li>
          ))}
        </ul>
      </nav>
      <p>
        <Icon name="copyright" iconPosition="left" size={10}>
          2024 - {getCurrentYear} Ganka&Home
        </Icon>
      </p>
    </Box>
  );
}
