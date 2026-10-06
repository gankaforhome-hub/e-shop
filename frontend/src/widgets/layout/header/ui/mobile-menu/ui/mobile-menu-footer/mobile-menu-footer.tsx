'use client';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

interface MobileMenuQuickActionsProps {
  className?: string;
  currentLang?: string;
  ariaLabelLangMenu?: string;
  onActionClick?: () => void;
  onLanguageClick?: () => void;
}

export function MobileMenuQuickActions({
  className,
  currentLang = 'UA',
  ariaLabelLangMenu,
  onActionClick,
  onLanguageClick,
}: MobileMenuQuickActionsProps) {
  return (
    <div
      className={cn(
        'max-[300px]:grid-cols-1',
        'border-border grid grid-cols-3 items-center justify-between border-t p-2',
        className,
      )}
    >
      {/* 1. WISHLIST */}
      <Button
        variant="ghost"
        asChild
        size="full"
        className={cn(
          'text-secondary-foreground rounded-none p-2',
          'border-border border-l',
          'hover:text-foreground duration-(--dur-norm) transition-colors',
        )}
      >
        <AppLink
          href={routes.wishlist}
          onClick={onActionClick}
          aria-label="Wishlist"
        >
          <Icon
            iconPosition="left"
            name="favorite"
            className="group-hover:text-brand size-4 stroke-[1.5]"
            aria-hidden="true"
          >
            Wishlist
          </Icon>
        </AppLink>
      </Button>

      {/* 2. ACCOUNT */}
      <Button
        variant="ghost"
        asChild
        size="full"
        className={cn(
          'text-secondary-foreground group rounded-none p-2',
          'border-border border-l',
          'hover:text-foreground duration-(--dur-norm) transition-colors',
        )}
      >
        <AppLink
          href={routes.account}
          onClick={onActionClick}
          aria-label="Account"
        >
          <Icon
            iconPosition="left"
            name="user"
            className="group-hover:text-brand size-4 stroke-[1.5]"
            aria-hidden="true"
          >
            Account
          </Icon>
        </AppLink>
      </Button>

      {/* 3. LANGUAGE SWITCHER */}
      <Button
        variant="ghost"
        size="full"
        onClick={onLanguageClick}
        aria-label={ariaLabelLangMenu}
        className={cn(
          'text-secondary-foreground hover:text-foreground duration-(--dur-norm) group rounded-none p-2 transition-colors',
          'border-border border-l',
        )}
      >
        <Icon
          iconPosition="left"
          name="language"
          className="group-hover:text-brand size-4 stroke-[1.5]"
          classNameContainer="uppercase"
          aria-hidden="true"
        >
          {currentLang}
        </Icon>
      </Button>
    </div>
  );
}
