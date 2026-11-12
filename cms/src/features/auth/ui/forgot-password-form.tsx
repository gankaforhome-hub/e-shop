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
import { forgotPasswordAction } from '../api/auth-actions';
import {
  forgotPasswordSchema,
  type AuthErrorKey,
  type ForgotPasswordValues,
} from '../model/auth.schema';

/** Asks for a reset link; the answer is the same whether the address has an account or not. */
export function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? t(`errors.${message as AuthErrorKey}`) : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await forgotPasswordAction(values);
    if (result.ok) {
      setIsSent(true);
    } else {
      setServerError(result.error);
    }
  });

  const backToSignIn = (
    <Text size="sm" variant="muted">
      <AppLink href={routes.auth.login} className="text-brand underline">
        {t('forgotPassword.toSignIn')}
      </AppLink>
    </Text>
  );

  if (isSent) {
    return (
      <AuthCard
        title={t('forgotPassword.sentTitle')}
        description={t('forgotPassword.sentText')}
      >
        {backToSignIn}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('forgotPassword.title')}
      description={t('forgotPassword.description')}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthField
          id="email"
          type="email"
          autoComplete="email"
          label={t('fields.email')}
          error={fieldError(errors.email?.message)}
          {...register('email')}
        />
        {serverError ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${serverError}`)}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {t('forgotPassword.submit')}
        </Button>
      </form>
      {backToSignIn}
    </AuthCard>
  );
}
