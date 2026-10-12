import { type InfoSlug } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import { DeliveryConditionsSection, FaqContentSection } from '../pages';

interface InfoContentProps {
  infoSlug: InfoSlug;
  lang: Locale;
}

export async function InfoContent({ infoSlug, lang }: InfoContentProps) {
  if (infoSlug === 'faq') {
    return <FaqContentSection lang={lang} />;
  }
  if (infoSlug === 'delivery') {
    return <DeliveryConditionsSection lang={lang} />;
  }

  // Placeholder copy until long-form MD/MDX content lands for these pages
  const { common } = await getDictionary(['common'], lang);
  const page = common.infoPages[infoSlug];

  return (
    <article className="flex flex-col gap-4">
      <Heading headingLevel="h1" variant="pageHeader">
        {page.title}
      </Heading>
      <Text>{page.text}</Text>
    </article>
  );
}
