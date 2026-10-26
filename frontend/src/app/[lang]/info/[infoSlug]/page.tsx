import { Suspense } from 'react';

import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { buildInfoNav } from '@/features/navigation';
import { InfoSlugs, isInfoSlug, routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { locales } from '@/shared/i18n/routing';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import {
  getInfoPageMeta,
  InfoContent,
  InfoContentSkeleton,
  InfoPageLayout,
  InfoPageLayoutSkeleton,
  ResponsiveNav,
} from '@/widgets/info';

interface PageProps {
  params: Promise<{
    lang: string;
    infoSlug: string;
  }>;
}

export function generateStaticParams() {
  return locales.flatMap(lang =>
    InfoSlugs.map(infoSlug => ({ lang, infoSlug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, infoSlug } = await params;
  if (!isValidLocale(lang) || !isInfoSlug(infoSlug)) {
    return {};
  }

  const { title, description, indexable } = await getInfoPageMeta(
    infoSlug,
    lang,
  );

  return {
    ...buildMetadata({
      meta: { title, description },
      lang,
      path: routes.info(infoSlug),
    }),
    robots: { index: indexable, follow: true },
  };
}

export default function InfoPage({ params }: PageProps) {
  return (
    <>
      <Breadcrumbs />
      <Section spacing="standard" flush="top">
        <Container>
          <Suspense fallback={<InfoPageLayoutSkeleton />}>
            <InfoPageBody params={params} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

async function InfoPageBody({ params }: PageProps) {
  const { lang, infoSlug } = await params;
  if (!isValidLocale(lang) || !isInfoSlug(infoSlug)) {
    notFound();
  }

  const { common } = await getDictionary(['common'], lang);
  const navItems = buildInfoNav(parseCommonDictionary(common).navigation);

  return (
    <InfoPageLayout
      nav={
        <ResponsiveNav
          items={navItems}
          currentSlug={infoSlug}
          labels={{
            nav: common.infoSection.navLabel,
            currentPage: common.infoSection.currentPage,
          }}
        />
      }
    >
      <Suspense fallback={<InfoContentSkeleton />}>
        <InfoContent infoSlug={infoSlug} lang={lang} />
      </Suspense>
    </InfoPageLayout>
  );
}
