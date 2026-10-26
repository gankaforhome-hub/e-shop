'use client';

import { useId, useMemo, type FocusEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitErrorHandler } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { showNotice } from '@/shared/lib/utils/toast';
import { Button } from '@/shared/ui/button';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { getInputClasses } from '@/shared/ui/input/input.styles';
import { PhoneInputField } from '@/shared/ui/input/phone-input';
import { Label } from '@/shared/ui/label';

import { submitLead } from '../api/submit-lead';
import { buildLeadPayload } from '../lib/build-lead-payload';
import { stripWhitespace } from '../lib/sanitize';
import {
  getLeadFormSchema,
  type LeadFormInput,
  type LeadFormValues,
} from '../model/lead-form.schema';
import { type LeadFormId } from '../model/lead-payload.schema';

const DEFAULT_VALUES: LeadFormInput = {
  email: '',
  phone: '',
  comment: '',
};

export interface LeadFormProps {
  /** Identifies the placement in the submitted payload. */
  formId: LeadFormId;
  formTitle?: string | undefined;
  btnLetsTalk: string;
  label: {
    email: string;
    phoneNumber: string;
    comment: string;
  };
}

/**
 * Lead form shared by every page that collects contact requests. Fields are
 * validated after the first blur (or on submit), then live on every change;
 * failed submissions keep the typed values for a retry.
 */
export function LeadForm({
  formId,
  formTitle,
  btnLetsTalk,
  label,
}: LeadFormProps) {
  const fieldId = useId();
  const pathname = usePathname();

  const tValidation = useTranslations('common.forms.validation');
  const tStatus = useTranslations('common.forms.status');
  const tPlaceholder = useTranslations('common.placeholder');
  const tAria = useTranslations('common.common.aria');

  const leadFormSchema = useMemo(
    () =>
      getLeadFormSchema(key =>
        tValidation(key as Parameters<typeof tValidation>[0]),
      ),
    [tValidation],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: DEFAULT_VALUES,
  });

  // The schema already ignores this whitespace; syncing it on blur keeps the
  // visible value equal to what gets sent
  const emailField = register('email', {
    onBlur: (event: FocusEvent<HTMLInputElement>) =>
      setValue('email', stripWhitespace(event.target.value)),
  });
  const commentField = register('comment', {
    onBlur: (event: FocusEvent<HTMLTextAreaElement>) =>
      setValue('comment', event.target.value.trim()),
  });

  const onSubmit = async (formData: LeadFormValues) => {
    const payload = buildLeadPayload({
      formId,
      sourcePage: pathname,
      formData,
    });
    // eslint-disable-next-line no-console -- lead trail until analytics lands
    console.log('[Lead Form Payload]:', payload);

    if (await submitLead(payload)) {
      reset(DEFAULT_VALUES);
      showNotice({
        tone: 'success',
        message: tStatus('success'),
        closeLabel: tAria('close'),
      });
      return;
    }

    showNotice({
      tone: 'error',
      message: tStatus('error'),
      closeLabel: tAria('close'),
    });
  };

  // Phone has no RHF ref, so focus the first invalid control in DOM order
  const onInvalid: SubmitErrorHandler<LeadFormInput> = (_errors, event) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const firstInvalid = form.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid?.focus({ preventScroll: true });
  };

  const ids = {
    email: `${fieldId}-email`,
    phone: `${fieldId}-phone`,
    comment: `${fieldId}-comment`,
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
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        aria-busy={isSubmitting}
        className="w-full"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor={ids.email} required>
            {label.email}
          </Label>
          <Input
            id={ids.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            disabled={isSubmitting}
            placeholder={tPlaceholder('email')}
            error={errors.email?.message}
            {...emailField}
          />
        </div>
        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor={ids.phone} required>
            {label.phoneNumber}
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInputField
                required
                name="phone"
                id={ids.phone}
                disabled={isSubmitting}
                placeholder={tPlaceholder('phone')}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                country="ua"
                error={errors.phone?.message}
              />
            )}
          />
        </div>
        {/* Comment */}
        <div className="space-y-1.5">
          <Label htmlFor={ids.comment}>{label.comment}</Label>
          <textarea
            id={ids.comment}
            rows={4}
            disabled={isSubmitting}
            placeholder={tPlaceholder('comments')}
            aria-invalid={Boolean(errors.comment)}
            className={cn(
              getInputClasses(Boolean(errors.comment)),
              'resize-none',
            )}
            {...commentField}
          />
          <ErrorMessage error={errors.comment?.message} />
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:max-w-75 mx-auto mt-8 flex w-full gap-2 md:mt-4 xl:mt-16"
          >
            {isSubmitting && (
              <Icon
                name="spinner"
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            )}
            {isSubmitting ? tStatus('sending') : btnLetsTalk}
          </Button>
        </div>
      </form>
    </div>
  );
}
