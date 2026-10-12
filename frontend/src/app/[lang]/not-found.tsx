import { type Metadata } from 'next';

import { lang as rootLang } from 'next/root-params';

import { getDictionary } from '@/shared/i18n/get-dictionary';
import { isValidLocale } from '@/shared/i18n/helpers';
import { defaultLocale } from '@/shared/i18n/routing';
import { NotFoundWidget } from '@/widgets/not-found';

// not-found.tsx receives no props; the locale comes from the `[lang]` root param
export async function generateMetadata(): Promise<Metadata> {
  const lang = await rootLang();
  const { common } = await getDictionary(
    ['common'],
    isValidLocale(lang) ? lang : defaultLocale,
  );

  return {
    title: common.notFound.pageTitle,
    description: common.notFound.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalizeNotFound() {
  return <NotFoundWidget />;
}
