'use client';

import { useEffect, useRef, useState } from 'react';

import { routes } from '@/shared/config/routes';
import { type AccountDict } from '@/shared/i18n/types';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';

import { AuthPanel } from './auth-panel';
import { verifyEmailAction } from '../api/auth-actions';
import { type AccountErrorKey } from '../model/auth.schema';
import { useLinkToken } from '../model/use-link-token';

interface VerifyEmailNoticeProps {
  dict: AccountDict;
}

type Status = 'pending' | 'done' | AccountErrorKey;

/** Landing of the welcome email: opening the link is the confirmation, no form. */
export function VerifyEmailNotice({ dict }: VerifyEmailNoticeProps) {
  const token = useLinkToken();
  const [status, setStatus] = useState<Status>('pending');
  // The token works once; a second run (Strict Mode) would report it as invalid
  const isSentRef = useRef(false);

  // Sync with the API once the fragment is readable (after hydration)
  useEffect(() => {
    if (token === null || isSentRef.current) {
      return;
    }
    isSentRef.current = true;
    if (!token) {
      setStatus('invalidToken');
      return;
    }
    void verifyEmailAction(token).then(result =>
      setStatus(result.ok ? 'done' : result.error),
    );
  }, [token]);

  if (status === 'pending') {
    return (
      <AuthPanel
        title={dict.verifyEmail.title}
        description={dict.verifyEmail.busy}
      >
        {null}
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title={
        status === 'done' ? dict.verifyEmail.doneTitle : dict.verifyEmail.title
      }
      description={
        status === 'done' ? dict.verifyEmail.doneText : dict.errors[status]
      }
    >
      <Button asChild className="self-start">
        <AppLink href={routes.account}>{dict.verifyEmail.toAccount}</AppLink>
      </Button>
    </AuthPanel>
  );
}
