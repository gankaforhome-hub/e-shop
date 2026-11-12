'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { FormField } from '@/shared/ui/form-field';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';

import { inviteMemberAction } from '../api/team-actions';
import {
  type AssignableRole,
  inviteSchema,
  type InviteValues,
  type TeamErrorKey,
} from '../model/team.schema';

const EMPTY_INVITE: InviteValues = { email: '', role: 'CONTENT_EDITOR' };

interface InviteDialogProps {
  roles: readonly AssignableRole[];
  /** Called with the address once the invitation is sent. */
  onInvited: (email: string) => void;
}

/** Email + role in a modal; the API sends the link to set the password. */
export function InviteDialog({ roles, onInvited }: InviteDialogProps) {
  const t = useTranslations('team');
  const id = useId();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<TeamErrorKey | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: EMPTY_INVITE,
    mode: 'onTouched',
  });

  const errorText = (message?: string) =>
    message ? t(`errors.${message as TeamErrorKey}`) : undefined;

  const onOpenChange = (next: boolean) => {
    if (next) {
      reset(EMPTY_INVITE);
      setFormError(null);
    }
    setOpen(next);
  };

  const onSubmit = handleSubmit(async values => {
    setFormError(null);
    const result = await inviteMemberAction(values);

    if (result.ok) {
      setOpen(false);
      onInvited(values.email);
    } else if (result.error === 'alreadyStaff') {
      setError('email', { message: result.error }, { shouldFocus: true });
    } else {
      setFormError(result.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="invite" />
          {t('invite.button')}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t('invite.close')}>
        <DialogTitle>{t('invite.title')}</DialogTitle>
        <DialogDescription>{t('invite.description')}</DialogDescription>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            id={`${id}-email`}
            label={t('invite.email')}
            error={errorText(errors.email?.message)}
          >
            <Input
              type="email"
              autoComplete="off"
              spellCheck={false}
              {...register('email')}
            />
          </FormField>
          <FormField id={`${id}-role`} label={t('invite.role')}>
            <Select {...register('role')}>
              {roles.map(role => (
                <option key={role} value={role}>
                  {t(`roles.${role}`)}
                </option>
              ))}
            </Select>
          </FormField>
          {formError ? (
            <Text role="alert" size="sm" variant="destructive">
              {t(`errors.${formError}`)}
            </Text>
          ) : null}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" disabled={isSubmitting}>
                {t('invite.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('invite.sending') : t('invite.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
