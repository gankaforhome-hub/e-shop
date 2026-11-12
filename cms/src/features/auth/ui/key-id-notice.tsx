'use client';

import { useId } from 'react';

import { useTranslations } from 'next-intl';

import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Text } from '@/shared/ui/text';

/**
 * Shown to a root admin after a new key: the API grants root rights only to keys listed
 * in `ROOT_CREDENTIAL_IDS`, so the id has to be copied to the server env.
 */
export function KeyIdNotice({ credentialId }: { credentialId: string }) {
  const t = useTranslations('auth.keyId');
  const id = useId();

  return (
    <div className="flex flex-col gap-3">
      <Text role="status" size="sm" variant="brand">
        {t('added')}
      </Text>
      <FormField id={id} label={t('label')} hint={t('rootHint')}>
        <Input
          readOnly
          value={credentialId}
          spellCheck={false}
          onFocus={event => event.currentTarget.select()}
        />
      </FormField>
    </div>
  );
}
