import { type Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { type SectionKey } from './types';

/**
 * `<title>` as "Page | Ganka CMS". Composed here rather than with the root
 * layout's `title.template`, which skips pages of the layout's own segment
 * (overview, not-found).
 */
export async function getPageTitle(title: string): Promise<string> {
  const t = await getTranslations('metadata');

  return `${title} | ${t('title')}`;
}

/** Title and description of a CMS section page. */
export async function getSectionMetadata(
  section: SectionKey,
): Promise<Metadata> {
  const t = await getTranslations('sections');

  return {
    title: await getPageTitle(t(`${section}.title`)),
    description: t(`${section}.description`),
  };
}
