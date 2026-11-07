'use client';

import { useState, useSyncExternalStore } from 'react';

import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { AuthCard } from './auth-card';
import { AuthField } from './auth-field';
import { verifyEmailAction } from '../api/auth-actions';
import { type AuthErrorKey } from '../model/auth.schema';

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

// The link keeps the token in the fragment, which the server never receives.
// `null` until hydration, empty when the link has no token.
function useLinkToken(): string | null {
  return useSyncExternalStore(
    subscribeToHash,
    () => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '',
    () => null,
  );
}

export function VerifyEmailForm() {
  const t = useTranslations('auth');
  const token = useLinkToken();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string }>({ mode: 'onTouched' });

  const onSubmit = handleSubmit(async ({ password }) => {
    setServerError(null);
    const result = await verifyEmailAction({ token: token ?? '', password });
    if (result.ok) {
      setIsVerified(true);
    } else {
      setServerError(result.error);
    }
  });

  if (isVerified) {
    return (
      <AuthCard
        title={t('verifyEmail.successTitle')}
        description={t('verifyEmail.successText')}
      >
        <Button asChild>
          <AppLink href={routes.auth.login}>
            {t('verifyEmail.toSignIn')}
          </AppLink>
        </Button>
      </AuthCard>
    );
  }

  if (token === '') {
    return (
      <AuthCard
        title={t('verifyEmail.title')}
        description={t('errors.invalidToken')}
      >
        <Button asChild>
          <AppLink href={routes.auth.login}>
            {t('verifyEmail.toSignIn')}
          </AppLink>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('verifyEmail.title')}
      description={t('verifyEmail.description')}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthField
          id="password"
          type="password"
          autoComplete="current-password"
          label={t('fields.password')}
          error={errors.password ? t('errors.required') : undefined}
          {...register('password', { required: true })}
        />
        {serverError ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${serverError}`)}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !token}>
          {t('verifyEmail.submit')}
        </Button>
      </form>
    </AuthCard>
  );
}
