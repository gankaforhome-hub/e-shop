import { notFound } from 'next/navigation';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ContactUsSection } from '@/widgets/sections/common/contact-us';

interface IContactsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ContactsPage({ params }: IContactsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  const { common, contacts } = await getDictionary(
    ['common', 'contacts'],
    lang,
  );
  const { social } = parseCommonDictionary(common);

  return (
    <>
      <Breadcrumbs />
      <Container>
        <Heading
          headingLevel="h1"
          variant="pageHeader"
          position="center"
          className="mx-auto"
        >
          {contacts.pageTitle}
        </Heading>
      </Container>
      <ContactUsSection contactUsForm={common.contactsUsForm} social={social} />
    </>
  );
}
