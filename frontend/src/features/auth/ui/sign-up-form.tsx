'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { routes } from '@/shared/config/routes';
import { type AccountDict } from '@/shared/i18n/types';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Input } from '@/shared/ui/input';
import { PhoneInputField } from '@/shared/ui/input/phone-input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { AuthPanel } from './auth-panel';
import { GoogleButton } from './google-button';
import { TurnstileWidget } from './turnstile-widget';
import { signUpAction } from '../api/auth-actions';
import {
  signUpSchema,
  type AccountErrorKey,
  type SignUpInput,
  type SignUpValues,
} from '../model/auth.schema';

interface SignUpFormProps {
  dict: AccountDict;
  /** Start URL of Google sign-in; undefined while it is not configured */
  googleHref?: string | undefined;
}

const linkClassName =
  'text-foreground-emphasis underline underline-offset-2 hover:text-action-primary duration-(--dur-fast) transition-colors';

const DEFAULT_VALUES: SignUpInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordRepeat: '',
  acceptTerms: false,
  marketingConsent: false,
};

/**
 * Name, surname and email are required, phone optional; the terms must be accepted, news and
 * offers are a separate unticked opt-in. The account works at once (soft email verification).
 */
export function SignUpForm({ dict, googleHref }: SignUpFormProps) {
  const id = useId();
  const [serverError, setServerError] = useState<AccountErrorKey | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput, unknown, SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });

  const fieldError = (message?: string) =>
    message ? dict.errors[message as AccountErrorKey] : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    // A new account is signed in and redirected; a taken address gets "check your email"
    const result = await signUpAction(values, turnstileToken);
    if (result.ok) {
      setCheckEmail(true);
    } else {
      setServerError(result.error);
    }
  });

  if (checkEmail) {
    return (
      <AuthPanel
        title={dict.signUp.checkEmailTitle}
        description={dict.signUp.checkEmailText}
      >
        <Button asChild>
          <AppLink href={routes.signIn}>{dict.signUp.toSignIn}</AppLink>
        </Button>
      </AuthPanel>
    );
  }

  const textField = (
    name: 'firstName' | 'lastName' | 'email' | 'password' | 'passwordRepeat',
    label: string,
    props: { type?: string; autoComplete: string; inputMode?: 'email' },
  ) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`${id}-${name}`} required>
        {label}
      </Label>
      <Input
        id={`${id}-${name}`}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        error={fieldError(errors[name]?.message)}
        {...register(name)}
      />
    </div>
  );

  return (
    <AuthPanel title={dict.signUp.title} description={dict.signUp.description}>
      <GoogleButton href={googleHref} dict={dict} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {textField('firstName', dict.fields.firstName, {
            autoComplete: 'given-name',
          })}
          {textField('lastName', dict.fields.lastName, {
            autoComplete: 'family-name',
          })}
        </div>
        {textField('email', dict.fields.email, {
          type: 'email',
          autoComplete: 'email',
          inputMode: 'email',
        })}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-phone`}>{dict.fields.phone}</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInputField
                name="phone"
                id={`${id}-phone`}
                disabled={isSubmitting}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldError(errors.phone?.message)}
              />
            )}
          />
          <Text size="small" variant="muted">
            {dict.signUp.phoneHint}
          </Text>
        </div>
        {textField('password', dict.fields.password, {
          type: 'password',
          autoComplete: 'new-password',
        })}
        {textField('passwordRepeat', dict.fields.passwordRepeat, {
          type: 'password',
          autoComplete: 'new-password',
        })}
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  ref={field.ref}
                  id={`${id}-terms`}
                  checked={field.value}
                  onCheckedChange={checked => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-required
                  aria-invalid={Boolean(errors.acceptTerms)}
                  className="mt-0.5"
                />
                <label
                  htmlFor={`${id}-terms`}
                  className="font-caption text-foreground cursor-pointer text-sm leading-snug"
                >
                  {dict.signUp.termsBefore}{' '}
                  <AppLink
                    href={routes.info('terms-conditions')}
                    target="_blank"
                    className={linkClassName}
                  >
                    {dict.signUp.termsLink}
                  </AppLink>{' '}
                  {dict.signUp.termsAnd}{' '}
                  <AppLink
                    href={routes.info('privacy-policy')}
                    target="_blank"
                    className={linkClassName}
                  >
                    {dict.signUp.privacyLink}
                  </AppLink>
                </label>
              </div>
              <ErrorMessage error={fieldError(errors.acceptTerms?.message)} />
            </div>
          )}
        />
        <Controller
          name="marketingConsent"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-3">
              <Checkbox
                ref={field.ref}
                id={`${id}-marketing`}
                checked={field.value}
                onCheckedChange={checked => field.onChange(checked === true)}
                onBlur={field.onBlur}
                className="mt-0.5"
              />
              <label
                htmlFor={`${id}-marketing`}
                className="font-caption text-foreground cursor-pointer text-sm leading-snug"
              >
                {dict.signUp.marketing}
              </label>
            </div>
          )}
        />
        <TurnstileWidget onToken={setTurnstileToken} />
        {serverError ? (
          <Text role="alert" size="small" variant="error">
            {dict.errors[serverError]}
          </Text>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {dict.signUp.submit}
        </Button>
      </form>
      <Text size="small" variant="muted">
        {dict.signUp.hasAccount}{' '}
        <AppLink href={routes.signIn} className="underline">
          {dict.signUp.toSignIn}
        </AppLink>
      </Text>
    </AuthPanel>
  );
}
