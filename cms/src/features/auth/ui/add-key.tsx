'use client';

import { useState, useTransition } from 'react';

import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

import { useTranslations } from 'next-intl';

import { useRouter } from '@/shared/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { KeyIdNotice } from './key-id-notice';
import {
  addKeyAction,
  getAddKeyOptionsAction,
  getSpareKeyAssertionOptionsAction,
} from '../api/auth-actions';
import { toKeyError } from '../lib/to-key-error';
import { type AuthErrorKey } from '../model/auth.schema';

interface AddKeyProps {
  userId: string;
  /** With a key already, the existing key confirms the new one first (two prompts in a row) */
  hasKey: boolean;
  /** Root keys go to `ROOT_CREDENTIAL_IDS`, so the new id is shown */
  showKeyId: boolean;
}

/** Optional sign-in key: the first one makes every later sign-in ask for it, more are spares. */
export function AddKey({ userId, hasKey, showKeyId }: AddKeyProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const addKey = async () => {
    try {
      let assertion;
      if (hasKey) {
        const assertionOptions =
          await getSpareKeyAssertionOptionsAction(userId);
        if (!assertionOptions.ok) {
          return setError(assertionOptions.error);
        }
        assertion = await startAuthentication({
          optionsJSON: assertionOptions.options,
        });
      }
      const options = await getAddKeyOptionsAction();
      if (!options.ok) {
        return setError(options.error);
      }
      const result = await addKeyAction(
        await startRegistration({ optionsJSON: options.options }),
        { assertion },
      );
      if (!result.ok) {
        return setError(result.error);
      }
      setAdded(result.credentialId);
      // The first key changes the session (it now needs the key): the shell reads it again
      router.refresh();
    } catch (cause) {
      setError(toKeyError(cause));
    }
  };

  const run = () =>
    startTransition(async () => {
      setError(null);
      setAdded(null);
      if (!browserSupportsWebAuthn()) {
        setError('keyUnsupported');
      } else {
        await addKey();
      }
    });

  return (
    <div className="flex flex-col items-start gap-4">
      {added && showKeyId ? <KeyIdNotice credentialId={added} /> : null}
      {added && !showKeyId ? (
        <Text role="status" size="sm" variant="brand">
          {t('keys.added')}
        </Text>
      ) : null}
      {error ? (
        <Text role="alert" size="sm" variant="destructive">
          {t(`errors.${error}`)}
        </Text>
      ) : null}
      <Button onClick={run} disabled={isPending}>
        <Icon name="key" />
        {isPending
          ? t('securityKey.busy')
          : hasKey
            ? t('keys.addSpare')
            : t('keys.addFirst')}
      </Button>
    </div>
  );
}
