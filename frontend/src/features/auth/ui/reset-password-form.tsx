'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { routes } from '@/shared/config/routes';
import { type AccountDict } from '@/shared/i18n/types';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { AuthPanel } from './auth-panel';
import { resetPasswordAction } from '../api/auth-actions';
import {
  newPasswordSchema,
  type AccountErrorKey,
  type NewPasswordInput,
} from '../model/auth.schema';
import { useLinkToken } from '../model/use-link-token';

interface ResetPasswordFormProps {
  dict: AccountDict;
}

/** Landing of the reset email. Until the form is sent, the old password keeps working. */
export function ResetPasswordForm({ dict }: ResetPasswordFormProps) {
  const id = useId();
  const token = useLinkToken();
  const [serverError, setServerError] = useState<AccountErrorKey | null>(null);
  const [isDone, setIsDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? dict.errors[message as AccountErrorKey] : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await resetPasswordAction(token ?? '', values);
    if (result.ok) {
      setIsDone(true);
    } else {
      setServerError(result.error);
    }
  });

  if (isDone || token === '') {
    return (
      <AuthPanel
        title={isDone ? dict.resetPassword.doneTitle : dict.resetPassword.title}
        description={
          isDone ? dict.resetPassword.doneText : dict.errors.invalidToken
        }
      >
        <Button asChild>
          <AppLink href={isDone ? routes.signIn : routes.forgotPassword}>
            {isDone ? dict.resetPassword.toSignIn : dict.resetPassword.again}
          </AppLink>
        </Button>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title={dict.resetPassword.title}
      description={dict.resetPassword.description}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-password`}>{dict.fields.newPassword}</Label>
          <Input
            id={`${id}-password`}
            type="password"
            autoComplete="new-password"
            error={fieldError(errors.password?.message)}
            {...register('password')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-repeat`}>{dict.fields.passwordRepeat}</Label>
          <Input
            id={`${id}-repeat`}
            type="password"
            autoComplete="new-password"
            error={fieldError(errors.passwordRepeat?.message)}
            {...register('passwordRepeat')}
          />
        </div>
        {serverError ? (
          <Text role="alert" size="small" variant="error">
            {dict.errors[serverError]}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !token}>
          {dict.resetPassword.submit}
        </Button>
      </form>
    </AuthPanel>
  );
}
