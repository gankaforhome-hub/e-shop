'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Text } from '@/shared/ui/text';

import { subscribeHandler } from '../api/subscribe';
import {
  FormSubscribe,
  SubscribeFormData,
  subscribeSchema,
} from '../model/subscribe.schema';

interface ISubscribeFormProps {
  className?: string;
  form: FormSubscribe;
}

export const SubscribeForm: FC<ISubscribeFormProps> = ({ className, form }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    try {
      setIsLoading(true);
      const { success, message } = await subscribeHandler(formData);
      if (success) {
        reset();
        //TODO Toaster('error');
        console.log('🚀 ~ message:', message);
      } else {
        //TODO Toaster('error');
        console.log('🚀 ~ message:', message);
      }
    } catch {
      //TODO Toaster('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('', className)}>
      <Box className="fmy-10/12 max-lg:fgap-7/9 lg:fgap-3/5 flex flex-col justify-between lg:grid-cols-2 lg:flex-row lg:items-center">
        {inputs.map(({ type, name, label }) => (
          <Box key={name} className="relative w-full">
            <Input
              id={name}
              type={type}
              placeholder=" "
              {...register(name)}
              className={cn(
                'custom-transition peer placeholder-transparent transition-all',
                errors[name] && 'border-b-destructive',
              )}
              aria-required
              aria-invalid={!!errors[name]}
              aria-describedby={`${name}-error`}
            />
            <Label
              htmlFor={name}
              className={cn(
                'text-fg custom-transition absolute left-0 transition-all',
                'peer-placeholder-shown:ftext-4/4.5 peer-placeholder-shown:text-fg top-0 peer-placeholder-shown:top-0',
                'peer-focus:ftext-2/2.5 peer-focus:text-fg/70 peer-focus:-top-2',
                'peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:ftext-2/2.5 peer-not-placeholder-shown:text-fg/70',
                !!errors[name] && 'ftext-2/2.5 text-fg/70 -top-2',
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
          </Box>
        ))}
      </Box>
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
