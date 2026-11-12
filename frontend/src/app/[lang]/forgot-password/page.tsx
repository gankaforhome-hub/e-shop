import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ForgotPasswordForm } from '@/features/auth';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface ForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ForgotPasswordPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Account and auth screens are never indexed (AGENTS.md §9)
  return {
    title: account.forgotPassword.title,
    robots: { index: false, follow: true },
  };
}

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container>
        <ForgotPasswordForm dict={account} />
      </Container>
    </Section>
  );
}
