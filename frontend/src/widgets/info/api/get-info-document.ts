import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { INFO_PAGES, type MarkdownInfoSlug } from '../config/info-pages';

export type InfoDocument = {
  /** Text of the leading `# ` heading (rendered as the page `h1`). */
  title: string;
  /** Markdown after the title. */
  body: string;
};

const DICTIONARIES_DIR = path.join(process.cwd(), 'dictionaries');
const TITLE_LINE = /^#\s+(.+)\r?\n/;

/** Splits the leading `# Title` line from the rest of the document. */
function parseInfoDocument(markdown: string): InfoDocument {
  // trimStart() also drops a UTF-8 BOM
  const source = markdown.trimStart();
  const match = TITLE_LINE.exec(source);

  if (!match?.[1]) {
    return { title: '', body: source };
  }

  return { title: match[1].trim(), body: source.slice(match[0].length) };
}

/**
 * Loads a localized long-form info document.
 * Cached across requests/builds; invalidate with `revalidateTag(cacheTags.infoPages)`
 * or the per-document `cacheTags.infoPage(slug, lang)` (e.g. from a CMS webhook).
 * Swap the file read for a CMS fetch without touching callers.
 */
export async function getInfoDocument(
  slug: MarkdownInfoSlug,
  lang: Locale,
): Promise<InfoDocument> {
  'use cache';
  cacheLife('days');
  cacheTag(cacheTags.infoPages, cacheTags.infoPage(slug, lang));

  const markdown = await readFile(
    path.join(DICTIONARIES_DIR, lang, INFO_PAGES[slug].source.file),
    'utf8',
  );

  return parseInfoDocument(markdown);
}
