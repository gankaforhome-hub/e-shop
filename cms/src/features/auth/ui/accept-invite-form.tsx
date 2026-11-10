'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { AuthCard } from './auth-card';
import { AuthField } from './auth-field';
import { acceptInviteAction } from '../api/auth-actions';
import {
  newPasswordSchema,
  type AuthErrorKey,
  type NewPasswordValues,
} from '../model/auth.schema';
import { useLinkToken } from '../model/use-link-token';

/** Landing of the invitation email: the invited person sets the password. */
export function AcceptInviteForm() {
  const t = useTranslations('auth');
  const token = useLinkToken();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? t(`errors.${message as AuthErrorKey}`) : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await acceptInviteAction({ ...values, token: token ?? '' });
    if (result.ok) {
      setIsAccepted(true);
    } else {
      setServerError(result.error);
    }
  });

  if (isAccepted || token === '') {
    return (
      <AuthCard
        title={
          isAccepted ? t('acceptInvite.successTitle') : t('acceptInvite.title')
        }
        description={
          isAccepted ? t('acceptInvite.successText') : t('errors.invalidToken')
        }
      >
        <Button asChild>
          <AppLink href={routes.auth.login}>
            {t('acceptInvite.toSignIn')}
          </AppLink>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('acceptInvite.title')}
      description={t('acceptInvite.description')}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthField
          id="password"
          type="password"
          autoComplete="new-password"
          label={t('fields.password')}
          error={fieldError(errors.password?.message)}
          {...register('password')}
        />
        <AuthField
          id="passwordRepeat"
          type="password"
          autoComplete="new-password"
          label={t('fields.passwordRepeat')}
          error={fieldError(errors.passwordRepeat?.message)}
          {...register('passwordRepeat')}
        />
        {serverError ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${serverError}`)}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !token}>
          {t('acceptInvite.submit')}
        </Button>
      </form>
    </AuthCard>
  );
}
