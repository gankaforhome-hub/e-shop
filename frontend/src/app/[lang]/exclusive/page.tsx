import { notFound } from 'next/navigation';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ContactUsSection } from '@/widgets/sections/common/contact-us';
import {
  HeroExclusive,
  OurExclusiveSection,
} from '@/widgets/sections/exclusive';

interface IExclusivePageProps {
  params: Promise<{ lang: string }>;
}

export default async function ExclusivePage({ params }: IExclusivePageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { exclusive, common } = await getDictionary(
    ['exclusive', 'common'],
    lang,
  );
  const { social } = parseCommonDictionary(common);

  return (
    <>
      <Breadcrumbs />
      <Container>
        <Heading headingLevel="h1" variant="pageHeader" visibility="hidden">
          {exclusive.pageTitle}
        </Heading>
      </Container>
      <HeroExclusive {...exclusive.hero} />
      <ContactUsSection
        sectionIntro={{
          title: exclusive.customOrder.title,
          description: exclusive.customOrder.description,
        }}
        contactUsForm={common.contactsUsForm}
        social={social}
      />
      <OurExclusiveSection {...exclusive.releases} />
    </>
  );
}
