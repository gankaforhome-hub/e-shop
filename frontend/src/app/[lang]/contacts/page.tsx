import { type Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { getMetadata, type IGetMetadataProps } from '@/shared/i18n/get-metada';
import { isValidLocale } from '@/shared/i18n/helpers';
import { buildMetadata } from '@/shared/i18n/helpers/build-metadata';
import { parseCommonDictionary } from '@/shared/i18n/schemas/common.schema';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { ContactUsSection } from '@/widgets/sections/common/contact-us';
import { ContactsHeroSection, HelpPrompt } from '@/widgets/sections/contacts';

const FORM_HEADING_ID = 'contacts-help-heading';

interface IContactsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: IGetMetadataProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const meta = await getMetadata('contacts', lang);

  return buildMetadata({ meta, lang, path: routes.contacts });
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
  const { social, contacts: contactLinks } = parseCommonDictionary(common);
  const { pageTitle, hero, channels, help, form } = contacts;

  return (
    <>
      <Breadcrumbs />
      <ContactsHeroSection
        heading={pageTitle}
        {...hero}
        channels={channels}
        contacts={contactLinks}
      />
      <ContactUsSection
        formId="contacts_form"
        spacing="standard"
        headingId={FORM_HEADING_ID}
        header={
          <HelpPrompt
            headingId={FORM_HEADING_ID}
            {...help}
            href={routes.info('faq')}
          />
        }
        contactUsForm={{ ...common.contactsUsForm, ...form }}
        social={social}
      />
    </>
  );
}
