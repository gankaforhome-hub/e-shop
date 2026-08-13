import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

interface IHeaderActionsProps {
  className?: string;
}

export function HeaderActions({ className }: IHeaderActionsProps) {
  return (
    <div className={cn('flex items-center gap-4 md:gap-6', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="max-lg:hidden"
        aria-label="Search"
      >
        <Icon name="search" size={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="max-lg:hidden"
        aria-label="User profile"
      >
        <Icon name="user" size={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="max-lg:hidden"
        aria-label="Favorites"
      >
        <Icon name="favorite" size={24} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Cart">
        <Icon name="shopping-cart" size={24} />
      </Button>
    </div>
  );
}
