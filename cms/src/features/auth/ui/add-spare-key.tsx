'use client';

import { useState, useTransition } from 'react';

import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

import { useTranslations } from 'next-intl';

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

interface AddSpareKeyProps {
  userId: string;
  /** Root keys go to `ROOT_CREDENTIAL_IDS`, so the new id is shown */
  showKeyId: boolean;
}

/**
 * A second key for a lost or broken device: an existing key confirms the action
 * (fresh assertion), then the new device registers. Two prompts in a row.
 */
export function AddSpareKey({ userId, showKeyId }: AddSpareKeyProps) {
  const t = useTranslations('auth');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const addKey = async () => {
    const assertionOptions = await getSpareKeyAssertionOptionsAction(userId);
    if (!assertionOptions.ok) {
      return setError(assertionOptions.error);
    }
    try {
      const assertion = await startAuthentication({
        optionsJSON: assertionOptions.options,
      });
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
          {t('keyId.added')}
        </Text>
      ) : null}
      {error ? (
        <Text role="alert" size="sm" variant="destructive">
          {t(`errors.${error}`)}
        </Text>
      ) : null}
      <Button onClick={run} disabled={isPending}>
        <Icon name="key" />
        {isPending ? t('securityKey.busy') : t('spareKey.button')}
      </Button>
    </div>
  );
}
