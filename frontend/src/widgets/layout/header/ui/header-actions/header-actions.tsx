import { CartDrawer } from '@/features/cart';
import { SearchPopover } from '@/features/product-search';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { FavoritesDrawer } from '../favorites-drawer';

interface HeaderActionsProps {
  label: {
    account: string;
    favorites: string;
  };
  className?: string;
}

const iconClassName =
  'group-hover:text-icon-hover duration-(--dur-normal) transition-colors';

export function HeaderActions({ label, className }: HeaderActionsProps) {
  return (
    <div className={cn('flex items-center gap-4 md:gap-6', className)}>
      {/* Below lg the search lives in the mobile menu */}
      <SearchPopover className="max-lg:hidden" />
      {/* Same destination as the mobile menu's account link */}
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="group max-lg:hidden"
      >
        <AppLink href={routes.account} aria-label={label.account}>
          <Icon name="user" size={24} className={iconClassName} />
        </AppLink>
      </Button>
      <FavoritesDrawer className="max-lg:hidden" />
      <CartDrawer />
    </div>
  );
}
