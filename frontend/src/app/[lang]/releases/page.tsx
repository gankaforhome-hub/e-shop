import { notFound } from 'next/navigation';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ReleasesSection } from '@/widgets/sections/releases';

interface IReleasesPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ReleasesPage({ params }: IReleasesPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }
  const { releases: dict } = await getDictionary(['releases'], lang);

  return (
    <>
      <Breadcrumbs />
      <Container>
        <Heading headingLevel="h1" variant="pageHeader" visibility="hidden">
          {dict.pageTitle}
        </Heading>
      </Container>
      <ReleasesSection {...dict.releases} />
    </>
  );
}
