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
import { signUpAction } from '../api/auth-actions';
import {
  signUpSchema,
  type AuthErrorKey,
  type SignUpValues,
} from '../model/auth.schema';

interface SignUpFormProps {
  /** Without a mail provider the email only reaches the backend console. */
  showDevHint: boolean;
}

export function SignUpForm({ showDevHint }: SignUpFormProps) {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? t(`errors.${message as AuthErrorKey}`) : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await signUpAction(values);
    if (result.ok) {
      setIsSubmitted(true);
    } else {
      setServerError(result.error);
    }
  });

  if (isSubmitted) {
    return (
      <AuthCard
        title={t('signUp.successTitle')}
        description={t('signUp.successText')}
      >
        {showDevHint ? (
          <Text role="note" size="sm">
            {t('signUp.devHint')}
          </Text>
        ) : null}
        <Button asChild>
          <AppLink href={routes.auth.login}>{t('signUp.toSignIn')}</AppLink>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t('signUp.title')} description={t('signUp.description')}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <AuthField
          id="email"
          type="email"
          autoComplete="email"
          label={t('fields.email')}
          error={fieldError(errors.email?.message)}
          {...register('email')}
        />
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
        <Button type="submit" disabled={isSubmitting}>
          {t('signUp.submit')}
        </Button>
      </form>
      <Text size="sm" variant="muted">
        {t('signUp.hasAccount')}{' '}
        <AppLink href={routes.auth.login} className="text-brand underline">
          {t('signUp.toSignIn')}
        </AppLink>
      </Text>
    </AuthCard>
  );
}
