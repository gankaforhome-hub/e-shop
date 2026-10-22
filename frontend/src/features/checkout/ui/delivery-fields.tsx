'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { useLocale, useTranslations } from 'next-intl';

import { ukraineDeliveryMethods } from '@/entities/order';
import { type Locale } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui/checkbox';
import { ErrorMessage } from '@/shared/ui/error-message';
import { Icon } from '@/shared/ui/icon';
import { getInputClasses } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

import { checkoutFieldId, CheckoutTextField } from './checkout-text-field';
import { ChoiceCard } from './choice-card';
import {
  type CheckoutFieldName,
  type CheckoutFormValues,
  isNovaPoshtaPointMethod,
  isStreetAddressMethod,
} from '../model/checkout.schema';
import {
  findNovaPoshtaCity,
  formatNovaPoshtaPoint,
  getNovaPoshtaCityNames,
  getNovaPoshtaPoints,
  type NovaPoshtaPointType,
} from '../model/nova-poshta';

const CITY_LIST_ID = 'checkout-np-cities';

// Fields that belong to one delivery method only; cleared on method switch
const METHOD_SPECIFIC_FIELDS: CheckoutFieldName[] = [
  'npPoint',
  'street',
  'house',
  'flat',
  'preferredTime',
];

export function DeliveryFields() {
  const { control } = useFormContext<CheckoutFormValues>();
  const region = useWatch({ control, name: 'region' });

  return region === 'ua' ? <UkraineDelivery /> : <InternationalDelivery />;
}

function UkraineDelivery() {
  const t = useTranslations('common.checkout');
  const lang = useLocale() as Locale;
  const { control, setValue, clearErrors } =
    useFormContext<CheckoutFormValues>();
  const method = useWatch({ control, name: 'deliveryMethod' });

  return (
    <div className="flex flex-col gap-6">
      <Controller
        name="deliveryMethod"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={value => {
              field.onChange(value);
              // A branch label is not a valid locker (and vice versa); typed addresses are kept
              setValue('npPoint', '');
              clearErrors(METHOD_SPECIFIC_FIELDS);
            }}
            aria-label={t('sections.delivery')}
            className="sm:grid-cols-2"
          >
            {ukraineDeliveryMethods.map(option => (
              <ChoiceCard
                key={option}
                value={option}
                title={t(`delivery.${option}.title`)}
                description={t(`delivery.${option}.description`)}
              />
            ))}
          </RadioGroup>
        )}
      />

      <div className="grid grid-cols-2 gap-x-4">
        <CheckoutTextField
          name="city"
          label={t('fields.city')}
          placeholder={t('placeholder.city')}
          autoComplete="address-level2"
          list={CITY_LIST_ID}
          required
          className="col-span-2"
          onValueChange={() => setValue('npPoint', '')}
        />
        <datalist id={CITY_LIST_ID}>
          {getNovaPoshtaCityNames(lang).map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>

        {isNovaPoshtaPointMethod(method) && (
          <NovaPoshtaPointField
            key={method}
            type={method === 'nova_poshta_locker' ? 'locker' : 'branch'}
          />
        )}

        {isStreetAddressMethod(method) && (
          <>
            <CheckoutTextField
              name="street"
              label={t('fields.street')}
              placeholder={t('placeholder.street')}
              autoComplete="address-line1"
              required
              className="col-span-2"
            />
            <CheckoutTextField
              name="house"
              label={t('fields.house')}
              placeholder={t('placeholder.house')}
              required
            />
            <CheckoutTextField
              name="flat"
              label={t('fields.flat')}
              placeholder={t('placeholder.flat')}
              autoComplete="address-line2"
            />
          </>
        )}

        {method === 'scheduled_courier' && (
          <CheckoutTextField
            name="preferredTime"
            label={t('fields.preferredTime')}
            placeholder={t('placeholder.preferredTime')}
            required
            className="col-span-2"
          />
        )}
      </div>
    </div>
  );
}

interface NovaPoshtaPointFieldProps {
  type: NovaPoshtaPointType;
}

/**
 * Branch / parcel-locker picker. Known cities get a select of their points;
 * any other city falls back to free text, so delivery is never blocked.
 */
function NovaPoshtaPointField({ type }: NovaPoshtaPointFieldProps) {
  const t = useTranslations('common.checkout');
  const lang = useLocale() as Locale;
  const {
    control,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<CheckoutFormValues>();
  const city = useWatch({ control, name: 'city' });

  const isLocker = type === 'locker';
  const label = isLocker ? t('fields.locker') : t('fields.branch');
  const knownCity = findNovaPoshtaCity(city);

  if (!knownCity) {
    return (
      <div className="col-span-2 flex flex-col">
        <CheckoutTextField
          name="npPoint"
          label={label}
          placeholder={
            isLocker
              ? t('placeholder.lockerNumber')
              : t('placeholder.branchNumber')
          }
          required
        />
        {city.trim() && (
          <Text
            as="p"
            size="none"
            variant="muted"
            className="-mt-2 ml-1 text-xs"
          >
            {t('hints.cityNotListed')}
          </Text>
        )}
      </div>
    );
  }

  const id = checkoutFieldId('npPoint');
  const error = errors.npPoint?.message;

  return (
    <div className="col-span-2 flex min-w-0 flex-col">
      <Label htmlFor={id} required>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          aria-required
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className={cn(
            getInputClasses(Boolean(error)),
            'cursor-pointer appearance-none truncate pr-11',
          )}
          {...register('npPoint')}
        >
          <option value="" disabled>
            {isLocker
              ? t('placeholder.selectLocker')
              : t('placeholder.selectBranch')}
          </option>
          {getNovaPoshtaPoints(knownCity, type).map(point => {
            const pointLabel = formatNovaPoshtaPoint(point, label, lang);
            return (
              <option key={point.number} value={pointLabel}>
                {pointLabel}
              </option>
            );
          })}
        </select>
        <Icon
          name="chevron-down"
          aria-hidden="true"
          className="text-icon pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
        />
      </div>
      <div className="min-h-4">
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}

function InternationalDelivery() {
  const t = useTranslations('common.checkout');
  const { control } = useFormContext<CheckoutFormValues>();
  const billingSame = useWatch({ control, name: 'billingSameAsShipping' });

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border bg-muted/60 flex items-start gap-3 rounded-lg border p-4">
        <Icon
          name="delivery"
          aria-hidden="true"
          className="text-icon mt-0.5 size-5 shrink-0"
        />
        <span className="flex flex-col gap-1">
          <Text as="span" size="none" className="text-sm md:text-base">
            {t('delivery.international.title')}
          </Text>
          <Text
            as="span"
            size="none"
            variant="muted"
            className="text-xs md:text-sm"
          >
            {t('delivery.international.description')}
          </Text>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <CheckoutTextField
          name="country"
          label={t('fields.country')}
          placeholder={t('placeholder.country')}
          autoComplete="country-name"
          required
        />
        <CheckoutTextField
          name="city"
          label={t('fields.city')}
          placeholder={t('fields.city')}
          autoComplete="address-level2"
          required
        />
        <CheckoutTextField
          name="address"
          label={t('fields.address')}
          placeholder={t('placeholder.address')}
          autoComplete="street-address"
          required
          className="sm:col-span-2"
        />
        <CheckoutTextField
          name="postalCode"
          label={t('fields.postalCode')}
          placeholder={t('placeholder.postalCode')}
          autoComplete="postal-code"
          required
        />
      </div>

      <Controller
        name="billingSameAsShipping"
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              id={checkoutFieldId('billingSameAsShipping')}
              checked={field.value}
              onCheckedChange={checked => field.onChange(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor={checkoutFieldId('billingSameAsShipping')}
              className="text-foreground font-caption cursor-pointer select-none text-sm md:text-base"
            >
              {t('fields.billingSame')}
            </label>
          </div>
        )}
      />

      {!billingSame && (
        <CheckoutTextField
          name="billingAddress"
          label={t('fields.billingAddress')}
          placeholder={t('placeholder.address')}
          autoComplete="billing street-address"
          required
        />
      )}
    </div>
  );
}
