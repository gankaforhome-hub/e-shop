'use client';

import { useState, useTransition } from 'react';

import { type AccountDict } from '@/shared/i18n/types';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { resendVerificationAction, signOutAction } from '../api/auth-actions';
import { type AccountErrorKey } from '../model/auth.schema';

interface ResendVerificationProps {
  dict: AccountDict;
}

export function ResendVerificationButton({ dict }: ResendVerificationProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'sent' | AccountErrorKey | null>(null);

  const resend = () =>
    startTransition(async () => {
      const result = await resendVerificationAction();
      setStatus(result.ok ? 'sent' : result.error);
    });

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="link"
        className="h-auto p-0"
        disabled={isPending}
        onClick={resend}
      >
        {dict.account.resend}
      </Button>
      {status ? (
        <Text
          role="status"
          size="small"
          variant={status === 'sent' ? 'success' : 'error'}
        >
          {status === 'sent' ? dict.account.resent : dict.errors[status]}
        </Text>
      ) : null}
    </div>
  );
}

export function SignOutButton({ label }: { label: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => signOutAction())}
    >
      {label}
    </Button>
  );
}
