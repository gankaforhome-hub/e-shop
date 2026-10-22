'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { type CartLine, type CartTotals } from '@/entities/cart';
import {
  deliveryRegions,
  isPaymentAvailable,
  type OrderPayload,
} from '@/entities/order';
import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Heading } from '@/shared/ui/heading';
import { getInputClasses } from '@/shared/ui/input';
import { PhoneInputField } from '@/shared/ui/input/phone-input';
import { Label } from '@/shared/ui/label';
import { RadioGroupItem, RadioGroupSegments } from '@/shared/ui/radio-group';

import { checkoutFieldId, CheckoutTextField } from './checkout-text-field';
import { DeliveryFields } from './delivery-fields';
import { OrderSummary } from './order-summary';
import { PaymentFields } from './payment-fields';
import { submitOrder } from '../api/submit-order';
import { buildOrderPayload, createOrderId } from '../lib/build-order-payload';
import {
  CHECKOUT_DEFAULT_VALUES,
  type CheckoutFormValues,
  getCheckoutSchema,
} from '../model/checkout.schema';

interface CheckoutFormProps extends CartTotals {
  lines: CartLine[];
  onSuccess: (order: OrderPayload) => void;
  /** Keeps the submit button busy while navigating to the confirmation page. */
  isRedirecting?: boolean;
}

/**
 * Checkout: region tabs, contacts, delivery, payment and comment on the left;
 * a sticky order summary with the submit button on the right (stacked on mobile).
 */
export function CheckoutForm({
  lines,
  totalAmount,
  totalQuantity,
  onSuccess,
  isRedirecting = false,
}: CheckoutFormProps) {
  const t = useTranslations('common.checkout');
  const tValidation = useTranslations('common.checkout.validation');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () => getCheckoutSchema(key => tValidation(key)),
    [tValidation],
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: CHECKOUT_DEFAULT_VALUES,
  });
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const isBusy = isSubmitting || isRedirecting;

  const handleRegionChange = (value: string) => {
    const region = deliveryRegions.find(item => item === value);
    if (!region) {
      return;
    }
    setValue('region', region);
    setValue(
      'deliveryMethod',
      region === 'ua' ? 'nova_poshta_branch' : 'international',
    );
    setValue('city', '');
    setValue('npPoint', '');
    if (!isPaymentAvailable(getValues('paymentMethod'), region)) {
      setValue('paymentMethod', 'liqpay');
    }
    clearErrors();
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError(null);
    const createdAt = new Date();
    const payload = buildOrderPayload({
      values,
      lines,
      orderId: createOrderId(
        createdAt,
        crypto.randomUUID().replaceAll('-', ''),
      ),
      createdAt,
    });

    // eslint-disable-next-line no-console -- requested trail of the exact request body
    console.log('[Checkout Payload]:', payload);

    if (await submitOrder(payload)) {
      onSuccess(payload);
      return;
    }
    setSubmitError(t('error'));
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-12 xl:gap-20"
      >
        <div className="flex min-w-0 flex-col gap-10 md:gap-12">
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <RadioGroupSegments
                value={field.value}
                onValueChange={handleRegionChange}
                aria-label={t('region.label')}
              >
                {deliveryRegions.map(region => (
                  <RadioGroupItem key={region} value={region} variant="segment">
                    {t(`region.${region}`)}
                  </RadioGroupItem>
                ))}
              </RadioGroupSegments>
            )}
          />

          <CheckoutSection id="contact" title={t('sections.contact')}>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <CheckoutTextField
                name="firstName"
                label={t('fields.firstName')}
                placeholder={t('placeholder.firstName')}
                autoComplete="given-name"
                required
              />
              <CheckoutTextField
                name="lastName"
                label={t('fields.lastName')}
                placeholder={t('placeholder.lastName')}
                autoComplete="family-name"
                required
              />
              <div className="flex min-w-0 flex-col">
                <Label htmlFor={checkoutFieldId('phone')} required>
                  {t('fields.phone')}
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInputField
                      id={checkoutFieldId('phone')}
                      name="phone"
                      required
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>
              <CheckoutTextField
                name="email"
                type="email"
                inputMode="email"
                label={t('fields.email')}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </CheckoutSection>

          <CheckoutSection id="delivery" title={t('sections.delivery')}>
            <DeliveryFields />
          </CheckoutSection>

          <CheckoutSection id="payment" title={t('sections.payment')}>
            <PaymentFields />
          </CheckoutSection>

          <CheckoutSection id="comment" title={t('sections.comment')}>
            <div className="flex flex-col">
              <Label htmlFor={checkoutFieldId('comment')} className="sr-only">
                {t('fields.comment')}
              </Label>
              <textarea
                id={checkoutFieldId('comment')}
                rows={4}
                disabled={isSubmitting}
                placeholder={t('placeholder.comment')}
                aria-invalid={Boolean(errors.comment)}
                className={cn(
                  getInputClasses(Boolean(errors.comment)),
                  'resize-none',
                )}
                {...register('comment')}
              />
              <div className="min-h-4">
                <ErrorMessage error={errors.comment?.message} />
              </div>
            </div>
          </CheckoutSection>
        </div>

        <div className="duration-(--dur-slow) ease-subtle lg:sticky lg:top-[calc(var(--h-header-desktop-current)+1.5rem)] lg:self-start lg:transition-[top]">
          <OrderSummary
            lines={lines}
            totalAmount={totalAmount}
            totalQuantity={totalQuantity}
            footer={
              <div className="flex flex-col gap-3">
                <TermsConsent />
                <Button
                  type="submit"
                  size="full"
                  disabled={isBusy}
                  aria-busy={isBusy}
                  className="py-3.5 text-base"
                >
                  {isBusy ? t('submitting') : t('submit')}
                </Button>
                <div role="alert" className="min-h-4">
                  <ErrorMessage
                    error={submitError ?? undefined}
                    className="ml-0 text-center"
                  />
                </div>
              </div>
            }
          />
        </div>
      </form>
    </FormProvider>
  );
}

interface CheckoutSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

function CheckoutSection({ id, title, children }: CheckoutSectionProps) {
  const headingId = `checkout-section-${id}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <Heading
        id={headingId}
        headingLevel="h2"
        variant="subsection"
        tone="emphasis"
      >
        {title}
      </Heading>
      {children}
    </section>
  );
}

/** Required agreement; legal pages open in a new tab so the form keeps its input. */
function TermsConsent() {
  const t = useTranslations('common.checkout');
  const {
    control,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  const id = checkoutFieldId('acceptTerms');
  const linkClassName =
    'text-foreground-emphasis underline underline-offset-2 hover:text-action-primary duration-(--dur-fast) transition-colors';

  return (
    <div className="flex flex-col">
      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              ref={field.ref}
              id={id}
              checked={field.value}
              onCheckedChange={checked => field.onChange(checked === true)}
              onBlur={field.onBlur}
              aria-required
              aria-invalid={Boolean(errors.acceptTerms)}
              className="mt-0.5"
            />
            <label
              htmlFor={id}
              className="text-foreground font-caption cursor-pointer text-sm leading-snug"
            >
              {t.rich('consent', {
                offer: chunks => (
                  <AppLink
                    href={routes.info('public-offer')}
                    target="_blank"
                    className={linkClassName}
                  >
                    {chunks}
                  </AppLink>
                ),
                privacy: chunks => (
                  <AppLink
                    href={routes.info('privacy-policy')}
                    target="_blank"
                    className={linkClassName}
                  >
                    {chunks}
                  </AppLink>
                ),
              })}
            </label>
          </div>
        )}
      />
      <div className="min-h-4 pl-8">
        <ErrorMessage error={errors.acceptTerms?.message} className="ml-0" />
      </div>
    </div>
  );
}
