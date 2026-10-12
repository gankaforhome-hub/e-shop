import { notFound } from 'next/navigation';

import { buildInfoNav } from '@/features/navigation';
import { InfoSlugs, isInfoSlug } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { locales } from '@/shared/i18n/routing';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { InfoContent, ResponsiveNav } from '@/widgets/sections/info/ui';

interface PageProps {
  params: Promise<{
    lang: string;
    infoSlug: string;
  }>;
}

export async function generateStaticParams() {
  const params: { lang: string; infoSlug: string }[] = [];

  for (const lang of locales) {
    for (const infoSlug of InfoSlugs) {
      params.push({ lang, infoSlug });
    }
  }
  return params;
}

export default async function InfoPage({ params }: PageProps) {
  const { lang, infoSlug } = await params;
  if (!isValidLocale(lang) || !isInfoSlug(infoSlug)) {
    notFound();
  }

  const validSlug = infoSlug;

  const { common } = await getDictionary(['common'], lang);
  const { navigation } = parseCommonDictionary(common);

  const navItems = buildInfoNav({
    main: navigation.main,
    help: navigation.help,
    legal: navigation.legal,
  });

  return (
    <>
      <Breadcrumbs />
      <Section>
        <Container>
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <aside className="w-full lg:sticky lg:w-64 lg:shrink-0">
              <ResponsiveNav items={navItems} currentSlug={validSlug} />
            </aside>

            <div className="w-full min-w-0 flex-1">
              <InfoContent infoSlug={validSlug} lang={lang} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
