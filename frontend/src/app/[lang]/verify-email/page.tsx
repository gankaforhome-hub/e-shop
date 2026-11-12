import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import {
  AccountOverviewSkeleton,
  VerifyEmailGate,
} from '@/features/auth/server';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface VerifyEmailPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: VerifyEmailPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Account and auth screens are never indexed (AGENTS.md §9)
  return {
    title: account.verifyEmail.title,
    robots: { index: false, follow: true },
  };
}

/** Landing of the confirmation email (`#token=`): confirms only in the own account's session. */
export default async function VerifyEmailPage({
  params,
}: VerifyEmailPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container className="max-w-md">
        <Suspense fallback={<AccountOverviewSkeleton />}>
          <VerifyEmailGate dict={account} />
        </Suspense>
      </Container>
    </Section>
  );
}
