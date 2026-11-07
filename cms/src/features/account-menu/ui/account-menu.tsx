'use client';

import { useTranslations } from 'next-intl';

import { UserAvatar, UserCard, type CmsUser } from '@/entities/user';
import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

interface AccountMenuProps {
  user: CmsUser;
  /** A Server Action from the composing widget: features don't import each other. */
  onSignOut: () => Promise<void>;
}

/** Desktop header badge: avatar trigger, identity and account links. */
export function AccountMenu({ user, onSignOut }: AccountMenuProps) {
  const t = useTranslations('account');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={t('menu')}
        >
          <UserAvatar name={user.name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-2">
          <UserCard user={user} caption={user.email} />
          <Text as="span" size="eyebrow" variant="brand" className="self-start">
            {t(`roles.${user.role}`)}
          </Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <AppLink href={routes.account}>
              <Icon name="account" />
              {t('profile')}
            </AppLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <AppLink href={routes.settings}>
              <Icon name="settings" />
              {t('settings')}
            </AppLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void onSignOut()}>
          <Icon name="sign-out" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
