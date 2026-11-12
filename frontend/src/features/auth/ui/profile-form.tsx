'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { routes } from '@/shared/config/routes';
import { useRouter } from '@/shared/i18n/navigation';
import { type AccountDict } from '@/shared/i18n/types';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { PhoneInputField } from '@/shared/ui/input/phone-input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { updateProfileAction } from '../api/auth-actions';
import {
  profileSchema,
  type AccountErrorKey,
  type ProfileInput,
  type ProfileValues,
} from '../model/auth.schema';

interface ProfileFormProps {
  dict: AccountDict;
  defaultValues: ProfileInput;
  /** `complete`: the one-time step after Google sign-in, then the account page */
  mode: 'complete' | 'edit';
}

/** Names (required), phone (optional) and the news-and-offers choice of the own account. */
export function ProfileForm({ dict, defaultValues, mode }: ProfileFormProps) {
  const id = useId();
  const router = useRouter();
  const [serverError, setServerError] = useState<AccountErrorKey | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues,
  });

  const fieldError = (message?: string) =>
    message ? dict.errors[message as AccountErrorKey] : undefined;

  const onSubmit = handleSubmit(async values => {
    setServerError(null);
    setIsSaved(false);
    const result = await updateProfileAction(values);
    if (!result.ok) {
      setServerError(result.error);
    } else if (mode === 'complete') {
      router.replace(routes.account);
    } else {
      setIsSaved(true);
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-first`} required>
            {dict.fields.firstName}
          </Label>
          <Input
            id={`${id}-first`}
            autoComplete="given-name"
            error={fieldError(errors.firstName?.message)}
            {...register('firstName')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-last`} required>
            {dict.fields.lastName}
          </Label>
          <Input
            id={`${id}-last`}
            autoComplete="family-name"
            error={fieldError(errors.lastName?.message)}
            {...register('lastName')}
          />
        </div>
      </div>
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
      </div>
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
      {serverError ? (
        <Text role="alert" size="small" variant="error">
          {dict.errors[serverError]}
        </Text>
      ) : null}
      {isSaved ? (
        <Text role="status" size="small" variant="success">
          {dict.profile.saved}
        </Text>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="sm:self-start">
        {dict.profile.save}
      </Button>
    </form>
  );
}
