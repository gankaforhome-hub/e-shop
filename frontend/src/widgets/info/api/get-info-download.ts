import { stat } from 'node:fs/promises';
import path from 'node:path';

import { cacheLife, cacheTag } from 'next/cache';

import 'server-only';

import { cacheTags } from '@/shared/config/cache-tags';
import { type Locale } from '@/shared/i18n/routing';

import { INFO_DOWNLOADS, type InfoDownloadId } from '../config/info-pages';

export type InfoDownload = {
  /** Public URL (not locale-prefixed), e.g. `/docs/notice_of_withdrawal_en.pdf`. */
  href: `/docs/${string}`;
  fileName: string;
  /** Upper-case file type for the UI, e.g. `PDF`. */
  format: string;
  /** Localized size, e.g. `231 kB`; `null` when the file is missing. */
  size: string | null;
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** Resolves a locale-specific static download and its file size (cached). */
export async function getInfoDownload(
  id: InfoDownloadId,
  lang: Locale,
): Promise<InfoDownload> {
  'use cache';
  cacheLife('days');
  cacheTag(cacheTags.infoPages);

  const { fileBase, extension } = INFO_DOWNLOADS[id];
  const fileName = `${fileBase}_${lang}.${extension}`;
  const href = `/docs/${fileName}` as const;

  const bytes = await stat(path.join(PUBLIC_DIR, 'docs', fileName)).then(
    file => file.size,
    () => null,
  );

  const size =
    bytes === null
      ? null
      : new Intl.NumberFormat(lang, {
          style: 'unit',
          unit: 'kilobyte',
          maximumFractionDigits: 0,
        }).format(Math.max(1, Math.round(bytes / 1024)));

  return { href, fileName, format: extension.toUpperCase(), size };
}
