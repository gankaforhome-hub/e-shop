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
import { TurnstileWidget } from './turnstile-widget';
import { forgotPasswordAction } from '../api/auth-actions';
import {
  forgotPasswordSchema,
  type AccountErrorKey,
  type ForgotPasswordInput,
} from '../model/auth.schema';

interface ForgotPasswordFormProps {
  dict: AccountDict;
}

/** Asks for a reset link; the answer is the same whether the address has an account or not. */
export function ForgotPasswordForm({ dict }: ForgotPasswordFormProps) {
  const id = useId();
  const [serverError, setServerError] = useState<AccountErrorKey | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    const result = await forgotPasswordAction(values, turnstileToken);
    if (result.ok) {
      setIsSent(true);
    } else {
      setServerError(result.error);
    }
  });

  const backToSignIn = (
    <Text size="small">
      <AppLink href={routes.signIn} className="underline">
        {dict.forgotPassword.toSignIn}
      </AppLink>
    </Text>
  );

  if (isSent) {
    return (
      <AuthPanel
        title={dict.forgotPassword.sentTitle}
        description={dict.forgotPassword.sentText}
      >
        {backToSignIn}
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title={dict.forgotPassword.title}
      description={dict.forgotPassword.description}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-email`}>{dict.fields.email}</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            error={
              errors.email?.message
                ? dict.errors[errors.email.message as AccountErrorKey]
                : undefined
            }
            {...register('email')}
          />
        </div>
        <TurnstileWidget onToken={setTurnstileToken} />
        {serverError ? (
          <Text role="alert" size="small" variant="error">
            {dict.errors[serverError]}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {dict.forgotPassword.submit}
        </Button>
      </form>
      {backToSignIn}
    </AuthPanel>
  );
}
