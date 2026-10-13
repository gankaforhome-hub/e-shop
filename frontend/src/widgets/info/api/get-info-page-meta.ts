import 'server-only';

import { type InfoSlug } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';

import { getInfoDocument } from './get-info-document';
import { INFO_PAGES, isMarkdownInfoSlug } from '../config/info-pages';

export type InfoPageMeta = {
  title: string;
  description: string;
  indexable: boolean;
};

const DESCRIPTION_MAX_LENGTH = 160;

/** First prose paragraph of a Markdown body (soft-wrapped lines joined), stripped of inline syntax. */
function extractDescription(markdown: string): string {
  const paragraph =
    markdown
      .split(/\r?\n\s*\r?\n/)
      .map(block => block.trim().replace(/\s*\r?\n\s*/g, ' '))
      .find(block => block !== '' && !/^([#>|*-]|\d+\.\s)/.test(block)) ?? '';

  const plain = paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '');

  return plain.length > DESCRIPTION_MAX_LENGTH
    ? `${plain.slice(0, DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`
    : plain;
}

/** Title/description/indexing for `generateMetadata` of an info page. */
export async function getInfoPageMeta(
  slug: InfoSlug,
  lang: Locale,
): Promise<InfoPageMeta> {
  const { indexable } = INFO_PAGES[slug];

  if (isMarkdownInfoSlug(slug)) {
    const { title, body } = await getInfoDocument(slug, lang);
    return { title, description: extractDescription(body) || title, indexable };
  }

  const { faq } = await getDictionary(['faq'], lang);

  return { title: faq.pageTitle, description: faq.pageTitle, indexable };
}
