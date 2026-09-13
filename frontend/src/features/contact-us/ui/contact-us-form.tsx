'use client';

import { startTransition, useActionState, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';
import { showSuccessBanner } from '@/shared/lib/utils/toast';
import { Button } from '@/shared/ui/button';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Heading } from '@/shared/ui/heading';
import { Input } from '@/shared/ui/input';
import { getInputClasses } from '@/shared/ui/input/input.styles';
import { PhoneInputField } from '@/shared/ui/input/phone-input';
import { Label } from '@/shared/ui/label';

import { submitContactUsAction } from '../api/contact-us.action';
import {
  getContactUsSchema,
  type ContactUsActionState,
  type ContactUsFormData,
} from '../model/contact-us.schema';

const initialState: ContactUsActionState = {
  success: false,
  message: '',
  errors: {},
};

export interface IContactUsFormProps {
  formTitle?: string;
  btnLetsTalk: string;
  label: {
    email: string;
    phoneNumber: string;
    comment: string;
  };
}

export const ContactUsForm = ({
  formTitle,
  btnLetsTalk,
  label,
}: IContactUsFormProps) => {
  const [state, formAction, isPending] = useActionState(
    submitContactUsAction,
    initialState,
  );

  const tValidation = useTranslations('common.forms.validation');
  const tStatus = useTranslations('common.forms.status');
  const tPlaceholder = useTranslations('common.placeholder');
  const tAria = useTranslations('common.common.aria');

  const contactUsSchema = useMemo(
    () =>
      getContactUsSchema(key =>
        tValidation(key as Parameters<typeof tValidation>[0]),
      ),
    [tValidation],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactUsFormData>({
    resolver: zodResolver(contactUsSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      phone: '',
      comment: '',
    },
  });

  useEffect(() => {
    if (!isPending && state.success && state.message) {
      showSuccessBanner({
        message: state.message,
        closeLabel: tAria('close'),
      });
      reset();
    }
  }, [state, isPending, reset, tAria]);

  const onSubmit = (data: ContactUsFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  const onError = () => {
    const firstErrorElement = document.querySelector(
      'input[aria-invalid="true"], textarea[aria-invalid="true"], [aria-invalid="true"]',
    );

    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      (firstErrorElement as HTMLElement).focus({ preventScroll: true });
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      {formTitle && (
        <Heading
          headingLevel="h3"
          variant="textPanel"
          className="mb-6 font-normal"
        >
          {formTitle}
        </Heading>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        className="w-full"
      >
        {!state.success && state.message && (
          <ErrorMessage error={state.message} />
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" required>
            {label.email}
          </Label>
          <Input
            id="email"
            type="email"
            disabled={isPending}
            placeholder={tPlaceholder('email')}
            hasError={!!errors.email || !!state.errors?.email}
            error={errors.email?.message || state.errors?.email?.[0]}
            {...register('email')}
          />
        </div>
        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" required>
            {label.phoneNumber}
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInputField
                required
                name="phone"
                id="phone"
                disabled={isPending}
                placeholder={tPlaceholder('phone')}
                hasError={!!errors.phone || !!state.errors?.phone}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                country={'ua'}
                error={errors.phone?.message || state.errors?.phone?.[0]}
              />
            )}
          />
        </div>
        {/* Comment */}
        <div className="space-y-1.5">
          <Label htmlFor="comment">{label.comment}</Label>
          <textarea
            id="comment"
            rows={4}
            disabled={isPending}
            placeholder={tPlaceholder('comments')}
            className={cn(
              getInputClasses(!!errors.comment || !!state.errors?.comment),
              'resize-none',
            )}
            {...register('comment')}
          />
          {(errors.comment || state.errors?.comment) && (
            <ErrorMessage
              error={errors.comment?.message || state.errors?.comment?.[0]}
            />
          )}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isPending}
            className="sm:max-w-75 mx-auto mt-8 flex w-full md:mt-4 xl:mt-16"
          >
            {isPending ? tStatus('sending') : btnLetsTalk}
          </Button>
        </div>
      </form>
    </div>
  );
};
