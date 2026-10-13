import { type InfoSlug } from '@/shared/config/routes';

/**
 * Static files in `public/docs/` served per locale as `<fileBase>_<lang>.<extension>`.
 * Labels live in `common.infoSection[dictionaryKey]`.
 */
export const INFO_DOWNLOADS = {
  'notice-of-withdrawal': {
    fileBase: 'notice_of_withdrawal',
    extension: 'pdf',
    dictionaryKey: 'noticeOfWithdrawal',
  },
} as const;

export type InfoDownloadId = keyof typeof INFO_DOWNLOADS;

/** Where an info page's body comes from. */
type InfoPageSource =
  { kind: 'markdown'; file: `${string}.md` } | { kind: 'faq' };

type InfoPageConfig = {
  source: InfoPageSource;
  /** `false` → `robots: { index: false, follow: true }` (legal/utility pages). */
  indexable: boolean;
  /** Downloadable assets rendered after the content (see `INFO_DOWNLOADS`). */
  downloads?: readonly InfoDownloadId[];
};

/**
 * Single source of truth for `/info/[infoSlug]` content: source, indexing and
 * downloads (nav items: `buildInfoNav` in `@/features/navigation`). Markdown files live in `frontend/dictionaries/[lang]/`.
 */
export const INFO_PAGES = {
  'privacy-policy': {
    source: { kind: 'markdown', file: 'privacy_policy.md' },
    indexable: false,
  },
  'terms-conditions': {
    source: { kind: 'markdown', file: 'terms_of_use.md' },
    indexable: false,
  },
  'public-offer': {
    source: { kind: 'markdown', file: 'public_offer.md' },
    indexable: false,
    downloads: ['notice-of-withdrawal'],
  },
  faq: {
    source: { kind: 'faq' },
    indexable: true,
  },
  'payment-delivery': {
    source: { kind: 'markdown', file: 'payment_delivery.md' },
    indexable: true,
  },
  'returns-exchanges': {
    source: { kind: 'markdown', file: 'returns_exchanges.md' },
    indexable: true,
    downloads: ['notice-of-withdrawal'],
  },
} as const satisfies Record<InfoSlug, InfoPageConfig>;

type InfoPages = typeof INFO_PAGES;

export type MarkdownInfoSlug = {
  [K in InfoSlug]: InfoPages[K]['source']['kind'] extends 'markdown'
    ? K
    : never;
}[InfoSlug];

export const getInfoDownloads = (slug: InfoSlug): readonly InfoDownloadId[] => {
  const page: InfoPageConfig = INFO_PAGES[slug];
  return page.downloads ?? [];
};

export const isMarkdownInfoSlug = (slug: InfoSlug): slug is MarkdownInfoSlug =>
  INFO_PAGES[slug].source.kind === 'markdown';
