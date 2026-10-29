import {
  matchSearchToken,
  normalizeSearchText,
  SEARCH_MATCH,
  toSearchTokens,
} from '@/shared/lib/utils';

import {
  type LocalizedProduct,
  type ProductVariantTranslation,
} from '../model/types';

/** Fewest letters/digits that start a search ("pl" does, "p" doesn't). */
export const SEARCH_QUERY_MIN_LENGTH = 2;

/** Input beyond this is ignored: no real query is longer. */
const SEARCH_QUERY_MAX_LENGTH = 80;
const SEARCH_QUERY_MAX_TOKENS = 6;

/** Fewest letters/digits compared with SKUs ("ndp" → `NDP-01-23`). */
const SKU_QUERY_MIN_LENGTH = 3;

/** Validated query shared by the catalog `?search=` and the header search. */
export type ProductSearchQuery = {
  /** Normalized words: `"Plate  Agro"` → `['plate', 'agro']`. */
  tokens: readonly string[];
  /** Letters and digits only, for SKU lookups: `"NDP-01-23"` → `'ndp0123'`. */
  compact: string;
};

/** Parses untrusted input; `null` when it is too short to search. */
export function parseProductSearchQuery(
  input: string | null | undefined,
): ProductSearchQuery | null {
  const tokens = toSearchTokens(
    (input ?? '').slice(0, SEARCH_QUERY_MAX_LENGTH),
  ).slice(0, SEARCH_QUERY_MAX_TOKENS);
  const compact = tokens.join('');

  return compact.length >= SEARCH_QUERY_MIN_LENGTH ? { tokens, compact } : null;
}

/** A catalog card (`toCatalogItems`, one per colour/glaze) as search reads it. */
export type SearchableCard = {
  product: Pick<
    LocalizedProduct,
    'slug' | 'title' | 'category' | 'primaryCollection'
  >;
  /** Colour/glaze of the card. */
  label?: string;
  filterable: { variants: readonly ProductVariantTranslation[] };
};

/**
 * The localized words of a card in one language. Search reads every locale,
 * so a Latin query finds a card on the Ukrainian site and vice versa.
 */
export type CardSearchTexts = {
  title: string;
  collection: string;
  category: string;
  /** Season of the card's collection. */
  season?: string;
  /** Colour/glaze of the card. */
  label?: string;
};

/** The card's own (current-locale) words, `seasonLabel` resolved by the caller. */
export const toCardSearchTexts = (
  { product, label }: Pick<SearchableCard, 'product' | 'label'>,
  seasonLabel?: string,
): CardSearchTexts => ({
  title: product.title,
  collection: product.primaryCollection.title,
  category: product.category.title,
  ...(seasonLabel && { season: seasonLabel }),
  ...(label && { label }),
});

export type ProductSearchHit = {
  /** Relevance: higher ranks first. */
  score: number;
  /** The card's SKU named by the query; the result opens on it. */
  variant?: ProductVariantTranslation;
};

/** A title match outranks a collection match, and so on down the list. */
const FIELD_WEIGHT = {
  title: 6,
  collection: 4,
  category: 3,
  seasonOrColour: 2,
  slug: 1,
} as const;

/** A SKU names one exact item, so it outranks any text match. */
const SKU_SCORE = { exact: 100, prefix: 60, partial: 30 } as const;

/** Extra points when the title starts with the whole query ("deep cer…"). */
const TITLE_PREFIX_BONUS = 10;

type WeightedText = { weight: number; text: string };

const weighted = (
  weight: number,
  ...parts: (string | undefined)[]
): WeightedText => ({
  weight,
  text: normalizeSearchText(parts.filter(Boolean).join(' ')),
});

function scoreSku(sku: string, compact: string): number {
  const normalized = normalizeSearchText(sku).replaceAll(' ', '');
  if (normalized === compact) {
    return SKU_SCORE.exact;
  }
  if (normalized.startsWith(compact)) {
    return SKU_SCORE.prefix;
  }
  return normalized.includes(compact) ? SKU_SCORE.partial : 0;
}

/** The card's best SKU for the compacted query, if any. */
function matchSku(
  variants: readonly ProductVariantTranslation[],
  compact: string,
): Required<ProductSearchHit> | undefined {
  if (compact.length < SKU_QUERY_MIN_LENGTH) {
    return undefined;
  }

  let best: Required<ProductSearchHit> | undefined;
  for (const variant of variants) {
    const score = scoreSku(variant.sku, compact);
    if (score > (best?.score ?? 0)) {
      best = { score, variant };
    }
  }
  return best;
}

/**
 * Relevance of a catalog card for `query`, `null` when it doesn't match.
 * Every word must match a field (title, collection, category, season or
 * colour in any of `texts` — one entry per locale —, Latin slugs; word >
 * prefix > partial), or the query's letters and digits must name one of the
 * card's SKUs.
 */
export function matchSearchCard(
  card: SearchableCard,
  query: ProductSearchQuery,
  texts: readonly CardSearchTexts[],
): ProductSearchHit | null {
  const { product } = card;
  const { primaryCollection: collection, category } = product;
  const titles = texts.map(({ title }) => normalizeSearchText(title));
  const fields: WeightedText[] = [
    weighted(FIELD_WEIGHT.title, ...titles),
    weighted(FIELD_WEIGHT.collection, ...texts.map(t => t.collection)),
    weighted(FIELD_WEIGHT.category, ...texts.map(t => t.category)),
    weighted(
      FIELD_WEIGHT.seasonOrColour,
      ...texts.flatMap(t => [t.season, t.label]),
    ),
    // Language-agnostic slugs: Latin queries also work on the Ukrainian site
    weighted(
      FIELD_WEIGHT.slug,
      product.slug,
      collection.slug,
      category.slug,
      collection.season,
    ),
  ];

  let textScore = 0;
  for (const token of query.tokens) {
    const best = Math.max(
      ...fields.map(
        ({ weight, text }) => weight * matchSearchToken(text, token),
      ),
    );
    if (best === SEARCH_MATCH.none) {
      textScore = 0;
      break;
    }
    textScore += best;
  }
  const phrase = query.tokens.join(' ');
  if (textScore > 0 && titles.some(title => title.startsWith(phrase))) {
    textScore += TITLE_PREFIX_BONUS;
  }

  const sku = matchSku(card.filterable.variants, query.compact);
  if (!sku && textScore === 0) {
    return null;
  }

  return {
    score: textScore + (sku?.score ?? 0),
    ...(sku && { variant: sku.variant }),
  };
}
