import { Text } from '@/shared/ui/text';

import { UserAvatar } from './user-avatar';
import { type CmsUser } from '../model/types';

/** Avatar, name and one secondary line (e-mail or role). */
export function UserCard({
  user,
  caption,
}: {
  user: CmsUser;
  caption: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <UserAvatar name={user.name} />
      <div className="grid min-w-0 flex-1 leading-tight">
        <Text
          as="span"
          size="sm"
          weight="medium"
          variant="emphasis"
          className="truncate"
        >
          {user.name}
        </Text>
        <Text as="span" size="xs" variant="muted" className="truncate">
          {caption}
        </Text>
      </div>
    </div>
  );
}
