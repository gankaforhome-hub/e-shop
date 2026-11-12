import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ResetPasswordForm } from '@/features/auth';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface ResetPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ResetPasswordPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Account and auth screens are never indexed (AGENTS.md §9)
  return {
    title: account.resetPassword.title,
    robots: { index: false, follow: true },
  };
}

/** Landing of the reset email (`#token=` in the fragment). */
export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container>
        <ResetPasswordForm dict={account} />
      </Container>
    </Section>
  );
}
