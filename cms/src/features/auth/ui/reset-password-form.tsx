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
import { resetPasswordAction } from '../api/auth-actions';
import {
  newPasswordSchema,
  type AuthErrorKey,
  type NewPasswordValues,
} from '../model/auth.schema';
import { useLinkToken } from '../model/use-link-token';

/** Landing of the reset email. Until the form is sent, the old password keeps working. */
export function ResetPasswordForm() {
  const t = useTranslations('auth');
  const token = useLinkToken();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isDone, setIsDone] = useState(false);
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
    const result = await resetPasswordAction({ ...values, token: token ?? '' });
    if (result.ok) {
      setIsDone(true);
    } else {
      setServerError(result.error);
    }
  });

  if (isDone || token === '') {
    return (
      <AuthCard
        title={isDone ? t('resetPassword.doneTitle') : t('resetPassword.title')}
        description={
          isDone ? t('resetPassword.doneText') : t('errors.invalidToken')
        }
      >
        <Button asChild>
          <AppLink
            href={isDone ? routes.auth.login : routes.auth.forgotPassword}
          >
            {isDone ? t('resetPassword.toSignIn') : t('resetPassword.again')}
          </AppLink>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('resetPassword.title')}
      description={t('resetPassword.description')}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthField
          id="password"
          type="password"
          autoComplete="new-password"
          label={t('fields.newPassword')}
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
          {t('resetPassword.submit')}
        </Button>
      </form>
    </AuthCard>
  );
}
