import { type INavItemConfig } from '@/features/navigation';
import { type InfoSlug } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';

interface InfoSideNavProps {
  items: INavItemConfig[];
  currentSlug: InfoSlug;
}

export function ResponsiveNav({ items, currentSlug }: InfoSideNavProps) {
  return (
    <nav className="max-lg:hidden lg:flex lg:flex-col lg:gap-4">
      {items.map(item => {
        const isActive = `/info/${currentSlug}` === item.href;

        return (
          <AppLink
            key={item.id}
            href={item.href}
            className={`shrink-0 whitespace-nowrap text-xs uppercase tracking-widest transition-colors md:text-sm ${
              isActive
                ? 'font-medium text-black underline underline-offset-4'
                : 'text-muted-foreground hover:text-black'
            }`}
          >
            {item.label}
          </AppLink>
        );
      })}
    </nav>
  );
}
