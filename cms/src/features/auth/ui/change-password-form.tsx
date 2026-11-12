'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { AuthField } from './auth-field';
import { changePasswordAction } from '../api/auth-actions';
import {
  changePasswordSchema,
  type AuthErrorKey,
  type ChangePasswordValues,
} from '../model/auth.schema';

/** Profile: the current password and a new one. Other sessions of the account end. */
export function ChangePasswordForm() {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? t(`errors.${message as AuthErrorKey}`) : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    setIsChanged(false);
    const result = await changePasswordAction(values);
    if (result.ok) {
      setIsChanged(true);
      reset();
    } else {
      setServerError(result.error);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <AuthField
        id="currentPassword"
        type="password"
        autoComplete="current-password"
        label={t('fields.currentPassword')}
        error={fieldError(errors.currentPassword?.message)}
        {...register('currentPassword')}
      />
      <AuthField
        id="newPassword"
        type="password"
        autoComplete="new-password"
        label={t('fields.newPassword')}
        error={fieldError(errors.password?.message)}
        {...register('password')}
      />
      <AuthField
        id="newPasswordRepeat"
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
      {isChanged ? (
        <Text role="status" size="sm" variant="brand">
          {t('changePassword.done')}
        </Text>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {t('changePassword.submit')}
      </Button>
    </form>
  );
}
