'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { type AccountDict } from '@/shared/i18n/types';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { AuthPanel } from './auth-panel';
import { GoogleButton } from './google-button';
import { signInAction } from '../api/auth-actions';
import {
  signInSchema,
  type AccountErrorKey,
  type SignInInput,
} from '../model/auth.schema';

interface SignInFormProps {
  dict: AccountDict;
  /** Start URL of Google sign-in; undefined while it is not configured */
  googleHref?: string | undefined;
  /** Stay on the current page after signing in (the email confirmation needs the session) */
  stay?: boolean;
}

export function SignInForm({
  dict,
  googleHref,
  stay = false,
}: SignInFormProps) {
  const id = useId();
  const router = useRouter();
  const [serverError, setServerError] = useState<AccountErrorKey | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
  });

  const fieldError = (message?: string) =>
    message ? dict.errors[message as AccountErrorKey] : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    // On success the action redirects to the account page, or with `stay` returns ok
    const result = await signInAction(values, { stay });
    if (!result.ok) {
      setServerError(result.error);
    } else if (stay) {
      router.refresh();
    }
  });

  return (
    <AuthPanel
      title={dict.signIn.title}
      description={
        stay ? dict.verifyEmail.signInFirst : dict.signIn.description
      }
    >
      <GoogleButton href={googleHref} dict={dict} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-email`}>{dict.fields.email}</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            error={fieldError(errors.email?.message)}
            {...register('email')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-password`}>{dict.fields.password}</Label>
          <Input
            id={`${id}-password`}
            type="password"
            autoComplete="current-password"
            error={fieldError(errors.password?.message)}
            {...register('password')}
          />
        </div>
        {serverError ? (
          <Text role="alert" size="small" variant="error">
            {dict.errors[serverError]}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {dict.signIn.submit}
        </Button>
      </form>
      <div className="flex flex-col gap-2">
        <Text size="small">
          <AppLink href={routes.forgotPassword} className="underline">
            {dict.signIn.forgotPassword}
          </AppLink>
        </Text>
        <Text size="small" variant="muted">
          {dict.signIn.noAccount}{' '}
          <AppLink href={routes.signUp} className="underline">
            {dict.signIn.toSignUp}
          </AppLink>
        </Text>
      </div>
    </AuthPanel>
  );
}
