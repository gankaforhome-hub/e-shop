import { CartDrawer } from '@/features/cart';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { FavoritesDrawer } from '../favorites-drawer';

interface HeaderActionsProps {
  label: {
    search: string;
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
      <Button
        variant="ghost"
        size="icon"
        className="group max-lg:hidden"
        aria-label={label.search}
      >
        <Icon name="search" size={24} className={iconClassName} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="group max-lg:hidden"
        aria-label={label.account}
      >
        <Icon name="user" size={24} className={iconClassName} />
      </Button>
      <FavoritesDrawer className="max-lg:hidden" />
      <CartDrawer />
    </div>
  );
}
