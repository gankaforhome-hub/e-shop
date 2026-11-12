import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/entities/user/server';
import { AddKey, ChangePasswordForm } from '@/features/auth';
import { getSectionMetadata } from '@/shared/i18n/get-section-metadata';
import { Heading } from '@/shared/ui/heading';
import { PageHeader } from '@/shared/ui/page-header';
import { Text } from '@/shared/ui/text';

// Reads the session: blocks like the shell instead of streaming
export const instant = false;

export function generateMetadata(): Promise<Metadata> {
  return getSectionMetadata('system.account');
}

/** The own account: password and optional sign-in keys. */
export default async function AccountPage() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);

  return (
    <div className="flex animate-in flex-col gap-8 duration-(--dur-normal) ease-subtle fade-in-0 slide-in-from-bottom-1 motion-reduce:animate-none">
      <PageHeader
        eyebrow={t('nav.groups.system.label')}
        title={t('sections.system.account.title')}
        description={t('sections.system.account.description')}
      />
      <section
        aria-labelledby="password-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <Heading id="password-heading" headingLevel="h2" variant="card">
            {t('auth.changePassword.title')}
          </Heading>
          <Text size="sm" variant="muted">
            {t('auth.changePassword.description')}
          </Text>
        </div>
        <ChangePasswordForm />
      </section>
      <section aria-labelledby="keys-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Heading id="keys-heading" headingLevel="h2" variant="card">
            {t('auth.keys.title')}
          </Heading>
          <Text size="sm" variant="muted">
            {user.hasKey
              ? t('auth.keys.descriptionWithKey')
              : t('auth.keys.descriptionNoKey')}
          </Text>
        </div>
        <AddKey
          userId={user.id}
          hasKey={user.hasKey}
          showKeyId={user.isRootRole}
        />
      </section>
    </div>
  );
}
