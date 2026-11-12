'use client';

import { useState, useTransition } from 'react';

import { useTranslations } from 'next-intl';

import { type TeamMember } from '@/entities/team-member';
import { useRouter } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';

import { InviteDialog } from './invite-dialog';
import {
  approveAccessAction,
  changeRoleAction,
  inviteMemberAction,
  resetKeysAction,
  revokeAccessAction,
  type TeamActionResult,
} from '../api/team-actions';
import {
  getAssignableRoles,
  isAssignableRole,
  type TeamErrorKey,
} from '../model/team.schema';

interface ConfirmButtonProps {
  kind: 'revoke' | 'resetKeys';
  member: TeamMember;
  onDone: (result: TeamActionResult, success?: string) => void;
}

/** Revoke the access or reset the keys, each behind a confirmation dialog. */
function ConfirmButton({ kind, member, onDone }: ConfirmButtonProps) {
  const t = useTranslations('team');
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { email, userId } = member;

  const confirm = () =>
    startTransition(async () => {
      const result =
        kind === 'revoke'
          ? await revokeAccessAction(userId)
          : await resetKeysAction(userId);
      setOpen(false);
      onDone(
        result,
        kind === 'resetKeys' ? t('resetKeys.done', { email }) : undefined,
      );
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghostDestructive"
          size="icon"
          aria-label={t(`${kind}.button`, { email })}
          title={t(`${kind}.button`, { email })}
        >
          <Icon name={kind === 'revoke' ? 'revoke' : 'key'} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{t(`${kind}.title`, { email })}</AlertDialogTitle>
        <AlertDialogDescription>
          {t(`${kind}.description`)}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost" disabled={isPending}>
              {t(`${kind}.cancel`)}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            onClick={event => {
              event.preventDefault();
              confirm();
            }}
          >
            <Button variant="destructive" disabled={isPending}>
              {t(`${kind}.confirm`)}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface TeamTableProps {
  members: TeamMember[];
  /** A key-confirmed root may also give the ADMIN role */
  canAssignAdmin: boolean;
}

/** Staff list for admins: invite, change the role, approve, invite again, reset keys, revoke. */
export function TeamTable({ members, canAssignAdmin }: TeamTableProps) {
  const t = useTranslations('team');
  const roles = getAssignableRoles(canAssignAdmin);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<TeamErrorKey | null>(null);

  const settle = (result: TeamActionResult, success?: string) => {
    setError(result.ok ? null : result.error);
    setNotice(result.ok ? (success ?? null) : null);
    router.refresh();
  };

  const run = (action: () => Promise<TeamActionResult>, success?: string) =>
    startTransition(async () => settle(await action(), success));

  const head =
    'px-3 py-2.5 text-left text-xs font-medium text-muted-foreground';
  const cell = 'px-3 py-2.5 align-middle';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite">
          {notice ? (
            <Text role="status" size="sm" variant="brand">
              {notice}
            </Text>
          ) : null}
          {error ? (
            <Text role="alert" size="sm" variant="destructive">
              {t(`errors.${error}`)}
            </Text>
          ) : null}
        </div>
        <InviteDialog
          roles={roles}
          onInvited={email => settle({ ok: true }, t('invite.sent', { email }))}
        />
      </div>
      {members.length === 0 ? (
        <EmptyState
          icon="team"
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <div
          className={cn(
            'overflow-x-auto rounded-xl border border-border bg-card shadow-card transition-opacity duration-(--dur-normal) ease-subtle',
            isPending && 'opacity-60',
          )}
        >
          <table className="w-full min-w-2xl border-collapse text-sm">
            <thead className="border-b border-border">
              <tr>
                <th scope="col" className={head}>
                  {t('table.email')}
                </th>
                <th scope="col" className={head}>
                  {t('table.role')}
                </th>
                <th scope="col" className={head}>
                  {t('table.status')}
                </th>
                <th scope="col" className={head}>
                  {t('table.key')}
                </th>
                <th scope="col" className={cn(head, 'w-40')}>
                  <span className="sr-only">{t('table.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const { userId, email, role, status, manageable } = member;
                const isRevoked = status === 'revoked';
                const canEditRole =
                  manageable && !isRevoked && isAssignableRole(role);
                const canApprove =
                  manageable && status === 'pending' && member.hasKey;
                const canReinvite =
                  manageable &&
                  (status === 'invited' || isRevoked) &&
                  isAssignableRole(role);

                return (
                  <tr
                    key={userId}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className={cell}>
                      <div className="flex flex-col">
                        <Text as="span" size="sm" variant="emphasis">
                          {email}
                        </Text>
                        {member.name ? (
                          <Text as="span" size="xs" variant="muted">
                            {member.name}
                          </Text>
                        ) : null}
                      </div>
                    </td>
                    <td className={cell}>
                      {canEditRole ? (
                        <Select
                          aria-label={t('changeRole', { email })}
                          value={role}
                          disabled={isPending}
                          className="w-auto"
                          onChange={event => {
                            const next = event.target.value;
                            run(() => changeRoleAction(userId, next));
                          }}
                        >
                          {roles.map(option => (
                            <option key={option} value={option}>
                              {t(`roles.${option}`)}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Text as="span" size="sm">
                          {t(`roles.${role}`)}
                        </Text>
                      )}
                    </td>
                    <td className={cell}>
                      <Text
                        as="span"
                        size="sm"
                        variant={
                          status === 'active'
                            ? 'brand'
                            : isRevoked
                              ? 'destructive'
                              : 'muted'
                        }
                      >
                        {status === 'pending' && !member.hasKey
                          ? t('status.awaitingKey')
                          : t(`status.${status}`)}
                      </Text>
                    </td>
                    <td className={cell}>
                      <Text as="span" size="sm" variant="muted">
                        {member.hasKey ? t('key.yes') : t('key.no')}
                      </Text>
                    </td>
                    <td className={cell}>
                      <div className="flex justify-end gap-1">
                        {canApprove ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            aria-label={t('approve', { email })}
                            title={t('approve', { email })}
                            onClick={() =>
                              run(
                                () => approveAccessAction(userId),
                                t('approved', { email }),
                              )
                            }
                          >
                            <Icon name="approve" />
                          </Button>
                        ) : null}
                        {canReinvite ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            aria-label={t('reinvite', { email })}
                            title={t('reinvite', { email })}
                            onClick={() =>
                              isAssignableRole(role) &&
                              run(
                                () => inviteMemberAction({ email, role }),
                                t('invite.sent', { email }),
                              )
                            }
                          >
                            <Icon name="invite" />
                          </Button>
                        ) : null}
                        {manageable && !isRevoked && member.hasKey ? (
                          <ConfirmButton
                            kind="resetKeys"
                            member={member}
                            onDone={settle}
                          />
                        ) : null}
                        {manageable && !isRevoked ? (
                          <ConfirmButton
                            kind="revoke"
                            member={member}
                            onDone={settle}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
