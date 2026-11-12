import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { SignInForm } from '@/features/auth';
import { isGoogleSignInEnabled } from '@/features/auth/server';
import { apiRoutes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface SignInPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: SignInPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const { account } = await getDictionary(['account'], lang);

  // Account and auth screens are never indexed (AGENTS.md §9)
  return {
    title: account.signIn.title,
    robots: { index: false, follow: true },
  };
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { account } = await getDictionary(['account'], lang);

  return (
    <Section>
      <Container>
        <SignInForm
          dict={account}
          googleHref={
            isGoogleSignInEnabled()
              ? `${apiRoutes.googleStart}?lang=${lang}`
              : undefined
          }
        />
      </Container>
    </Section>
  );
}
