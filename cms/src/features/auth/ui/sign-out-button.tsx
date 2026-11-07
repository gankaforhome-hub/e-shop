import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { signOutAction } from '../api/auth-actions';

export function SignOutButton({ label }: { label: string }) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" className="w-full justify-start">
        <Icon name="sign-out" />
        {label}
      </Button>
    </form>
  );
}
