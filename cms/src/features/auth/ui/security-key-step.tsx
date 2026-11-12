'use client';

import { useId, useState, useTransition } from 'react';

import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

import { useTranslations } from 'next-intl';

import { type KeyStep } from '@/entities/user';
import { useRouter } from '@/shared/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

import { AuthCard } from './auth-card';
import { KeyIdNotice } from './key-id-notice';
import { SignOutButton } from './sign-out-button';
import {
  addKeyAction,
  confirmKeyAction,
  getAddKeyOptionsAction,
  getConfirmKeyOptionsAction,
} from '../api/auth-actions';
import { toKeyError } from '../lib/to-key-error';
import { type AuthErrorKey } from '../model/auth.schema';

interface SecurityKeyStepProps {
  step: KeyStep;
  /** A root account adds keys only with the code from `admin:bootstrap-root` */
  enrollmentCodeRequired: boolean;
}

/**
 * The step between the password and the CMS: add the first key, confirm the session with
 * it, or wait until an ADMIN / root approves the access.
 */
export function SecurityKeyStep({
  step,
  enrollmentCodeRequired,
}: SecurityKeyStepProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const codeId = useId();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [code, setCode] = useState('');
  // A root admin copies the id of the new key to the server env before going on
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const withCode = step === 'add' && enrollmentCodeRequired;

  const addKey = async () => {
    const enrollmentCode = code.trim() || undefined;
    if (withCode && !enrollmentCode) {
      return setError('required');
    }
    const options = await getAddKeyOptionsAction(enrollmentCode);
    if (!options.ok) {
      return setError(options.error);
    }
    try {
      const result = await addKeyAction(
        await startRegistration({ optionsJSON: options.options }),
        { enrollmentCode },
      );
      if (!result.ok) {
        return setError(result.error);
      }
      if (withCode) {
        return setCredentialId(result.credentialId);
      }
    } catch (cause) {
      return setError(toKeyError(cause));
    }
    // The page reads the session again and moves on to the confirmation
    router.refresh();
  };

  const confirmKey = async () => {
    const options = await getConfirmKeyOptionsAction();
    if (!options.ok) {
      return setError(options.error);
    }
    let response;
    try {
      response = await startAuthentication({ optionsJSON: options.options });
    } catch (cause) {
      return setError(toKeyError(cause));
    }
    // Redirects to the CMS on success, so it stays out of the try block
    const result = await confirmKeyAction(response);
    if (!result.ok) {
      setError(result.error);
    }
  };

  const run = () =>
    startTransition(async () => {
      setError(null);
      if (step === 'approval' || credentialId) {
        router.refresh();
      } else if (!browserSupportsWebAuthn()) {
        setError('keyUnsupported');
      } else if (step === 'add') {
        await addKey();
      } else {
        await confirmKey();
      }
    });

  return (
    <AuthCard
      title={t(`securityKey.${step}.title`)}
      description={t(`securityKey.${step}.description`)}
    >
      <div className="flex flex-col gap-4">
        {credentialId ? <KeyIdNotice credentialId={credentialId} /> : null}
        {withCode && !credentialId ? (
          <FormField
            id={codeId}
            label={t('securityKey.code.label')}
            hint={t('securityKey.code.hint')}
          >
            <Input
              value={code}
              autoComplete="one-time-code"
              spellCheck={false}
              onChange={event => setCode(event.target.value)}
            />
          </FormField>
        ) : null}
        {error ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${error}`)}
          </Text>
        ) : null}
        <Button onClick={run} disabled={isPending}>
          <Icon name="key" />
          {credentialId
            ? t('keyId.continue')
            : isPending && step !== 'approval'
              ? t('securityKey.busy')
              : t(`securityKey.${step}.button`)}
        </Button>
        <SignOutButton label={t('securityKey.signOut')} />
      </div>
    </AuthCard>
  );
}
