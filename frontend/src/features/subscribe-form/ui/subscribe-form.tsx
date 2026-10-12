'use client';

import { type FC, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { showSuccessBanner } from '@/shared/lib/utils/toast';
import { Button } from '@/shared/ui/button';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Icon } from '@/shared/ui/icon';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { subscribeHandler } from '../api/subscribe';
import {
  type FormSubscribe,
  getSubscribeSchema,
  type SubscribeFormData,
} from '../model/subscribe.schema';

interface SubscribeFormProps {
  className?: string;
  form: FormSubscribe;
}

export const SubscribeForm: FC<SubscribeFormProps> = ({ className, form }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const tValidation = useTranslations('common.forms.validation');
  const tSubscribe = useTranslations('common.subscribe');
  const tAria = useTranslations('common.common.aria');

  const subscribeSchema = useMemo(
    () =>
      getSubscribeSchema(key =>
        key === 'tooLong' ? tSubscribe('firstNameTooLong') : tValidation(key),
      ),
    [tValidation, tSubscribe],
  );

  const { inputs, buttonText } = form;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { firstName: '', emailSubscription: '' },
    shouldFocusError: false,
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SubscribeFormData> = async formData => {
    setSubmitError(null);
    try {
      setIsLoading(true);
      const { success, message } = await subscribeHandler(formData);
      if (success) {
        reset();
        showSuccessBanner({ message, closeLabel: tAria('close') });
      } else {
        setSubmitError(message);
      }
    } catch {
      setSubmitError(tSubscribe('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('', className)}>
      <div className="fmy-10/12 max-lg:fgap-7/9 lg:fgap-3/5 flex flex-col items-center justify-between lg:grid-cols-2 lg:flex-row lg:items-center">
        {inputs.map(({ type, name, label }) => (
          <div key={name} className="relative w-full">
            <input
              id={name}
              type={type}
              placeholder=" "
              {...register(name)}
              className={cn(
                'custom-transition peer placeholder-transparent transition-all',
                errors[name] && 'border-b-status-error-fg',
              )}
              aria-required
              aria-invalid={!!errors[name]}
              aria-describedby={`${name}-error`}
            />
            <Label
              htmlFor={name}
              className={cn(
                'text-foreground custom-transition absolute left-0 transition-all',
                'peer-placeholder-shown:ftext-4/4.5 peer-placeholder-shown:text-foreground top-0 peer-placeholder-shown:top-0',
                'peer-focus:ftext-2/2.5 peer-focus:text-foreground/70 peer-focus:-top-2',
                'peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:ftext-2/2.5 peer-not-placeholder-shown:text-foreground/70',
                !!errors[name] && 'ftext-2/2.5 text-foreground/70 -top-2',
              )}
            >
              {label}
            </Label>
            {errors[name] && (
              <Text
                id={`${name}-error`}
                role="alert"
                as="span"
                className="text-destructive ftext-2.5/3 absolute -bottom-4 left-0"
              >
                {errors[name].message}
              </Text>
            )}
          </div>
        ))}
      </div>
      {submitError && <ErrorMessage error={submitError} />}
      <Button
        disabled={isLoading}
        variant="outline"
        type="submit"
        className="fpx-5/6 capitalize"
      >
        {buttonText}
        {isLoading && <Icon name="spinner" className="ml-2 animate-spin" />}
      </Button>
    </form>
  );
};
