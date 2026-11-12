import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import {
  AccountOverview,
  AccountOverviewSkeleton,
} from '@/features/auth/server';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface AccountPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AccountPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Personal page: never indexed (AGENTS.md §9)
  return {
    title: account.account.title,
    robots: { index: false, follow: true },
  };
}

/** The customer's own page; the session is read inside the Suspense boundary. */
export default async function AccountPage({ params }: AccountPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container className="flex max-w-2xl flex-col gap-8">
        <Heading headingLevel="h1" variant="document" tone="emphasis">
          {account.account.title}
        </Heading>
        <Suspense fallback={<AccountOverviewSkeleton />}>
          <AccountOverview dict={account} />
        </Suspense>
      </Container>
    </Section>
  );
}
