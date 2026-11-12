import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import {
  AccountOverviewSkeleton,
  CompleteProfile,
} from '@/features/auth/server';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface CompleteProfilePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: CompleteProfilePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Personal page: never indexed (AGENTS.md §9)
  return {
    title: account.profile.completeTitle,
    robots: { index: false, follow: true },
  };
}

/** Google gave no full name: the customer adds it once; the session is read in Suspense. */
export default async function CompleteProfilePage({
  params,
}: CompleteProfilePageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container className="flex max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading headingLevel="h1" variant="document" tone="emphasis">
            {account.profile.completeTitle}
          </Heading>
          <Text size="small" variant="muted">
            {account.profile.completeDescription}
          </Text>
        </div>
        <Suspense fallback={<AccountOverviewSkeleton />}>
          <CompleteProfile dict={account} />
        </Suspense>
      </Container>
    </Section>
  );
}
