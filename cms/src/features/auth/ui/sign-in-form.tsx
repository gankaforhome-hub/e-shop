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
import { signInAction } from '../api/auth-actions';
import {
  signInSchema,
  type AuthErrorKey,
  type SignInValues,
} from '../model/auth.schema';

export function SignInForm() {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? t(`errors.${message as AuthErrorKey}`) : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    // On success the action redirects and does not return
    const result = await signInAction(values);
    if (!result.ok) {
      setServerError(result.error);
    }
  });

  return (
    <AuthCard title={t('signIn.title')} description={t('signIn.description')}>
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
          autoComplete="current-password"
          label={t('fields.password')}
          error={fieldError(errors.password?.message)}
          {...register('password')}
        />
        {serverError ? (
          <Text role="alert" size="sm" variant="destructive">
            {t(`errors.${serverError}`)}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {t('signIn.submit')}
        </Button>
      </form>
      <Text size="sm" variant="muted">
        {t('signIn.noAccount')}{' '}
        <AppLink href={routes.auth.register} className="text-brand underline">
          {t('signIn.toSignUp')}
        </AppLink>
      </Text>
    </AuthCard>
  );
}
