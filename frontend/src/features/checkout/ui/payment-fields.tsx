'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { isPaymentAvailable, paymentMethods } from '@/entities/order';
import { type IconName } from '@/shared/types';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Icon } from '@/shared/ui/icon';
import { RadioGroup } from '@/shared/ui/radio-group';

import { ChoiceCard } from './choice-card';
import { type CheckoutFormValues } from '../model/checkout.schema';

const LIQPAY_BRANDS: IconName[] = ['liqpay', 'visa', 'mastercard'];

export function PaymentFields() {
  const t = useTranslations('common.checkout');
  const {
    control,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  const region = useWatch({ control, name: 'region' });

  return (
    <Controller
      name="paymentMethod"
      control={control}
      render={({ field }) => (
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          aria-label={t('sections.payment')}
        >
          {paymentMethods
            .filter(method => isPaymentAvailable(method, region))
            .map(method => (
              <ChoiceCard
                key={method}
                value={method}
                title={t(`payment.${method}.title`)}
                description={t(`payment.${method}.description`)}
                aside={
                  method === 'liqpay' && (
                    <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
                      {LIQPAY_BRANDS.map(brand => (
                        <Icon
                          key={brand}
                          name={brand}
                          aria-hidden="true"
                          className="h-6 w-8 stroke-0"
                        />
                      ))}
                    </span>
                  )
                }
              />
            ))}
          <ErrorMessage error={errors.paymentMethod?.message} />
        </RadioGroup>
      )}
    />
  );
}
