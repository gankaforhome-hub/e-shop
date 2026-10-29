import 'server-only';

import { getCollections } from '@/entities/collection';
import { searchProducts } from '@/entities/product';
import { parseProductSearchQuery } from '@/entities/product/catalog';
import { type Locale, locales } from '@/shared/i18n/routing';
import {
  matchSearchToken,
  normalizeSearchText,
  SEARCH_MATCH,
} from '@/shared/lib/utils';

import { isCollectionsQuery } from '../lib/collections-query';
import { type SearchResponse, type SearchSuggestion } from '../model/types';

/** Product rows in the dropdown; the rest is one click away (`/products?search=`). */
const SEARCH_PRODUCTS_LIMIT = 6;
const SEARCH_SUGGESTIONS_LIMIT = 3;

/** Shortest query word that may suggest a collection. */
const SUGGESTION_TOKEN_MIN_LENGTH = 2;

const EMPTY_RESPONSE: SearchResponse = {
  products: [],
  suggestions: [],
  total: 0,
};

/** A collection to suggest and the words it is found by (every locale). */
type SuggestionCandidate = { suggestion: SearchSuggestion; text: string };

/**
 * Collections whose name in any locale (or Latin slug) starts with one of the
 * query words, best first. Any word is enough: "plate agro" still suggests
 * Agro.
 */
function rankSuggestions(
  candidates: readonly SuggestionCandidate[],
  tokens: readonly string[],
): SearchSuggestion[] {
  const words = tokens.filter(
    token => token.length >= SUGGESTION_TOKEN_MIN_LENGTH,
  );

  return candidates
    .flatMap(({ suggestion, text }) => {
      const score = words.reduce((total, token) => {
        const match = matchSearchToken(text, token);
        return match >= SEARCH_MATCH.prefix ? total + match : total;
      }, 0);
      return score > 0 ? [{ suggestion, score }] : [];
    })
    .toSorted((a, b) => b.score - a.score)
    .slice(0, SEARCH_SUGGESTIONS_LIMIT)
    .map(({ suggestion }) => suggestion);
}

/**
 * Header search: relevance-ranked product cards (`searchProducts`, the
 * swappable data source; it also matches category, season and SKU, in every
 * locale), their total, and matching collections as direct links. Too short
 * a query, or one asking for the collections themselves
 * (`isCollectionsQuery`, the UI links to the collections page), returns
 * nothing.
 */
export async function searchCatalog({
  lang,
  query,
}: {
  lang: Locale;
  query: string;
}): Promise<SearchResponse> {
  const parsed = parseProductSearchQuery(query);
  if (!parsed || isCollectionsQuery(query)) {
    return EMPTY_RESPONSE;
  }

  const [{ items, total }, ...collectionsByLocale] = await Promise.all([
    searchProducts({ lang, query, limit: SEARCH_PRODUCTS_LIMIT }),
    ...locales.map(locale => getCollections(locale)),
  ]);
  const titlesById = Map.groupBy(collectionsByLocale.flat(), ({ id }) => id);

  // One row per name: collections titled alike would read as a duplicate
  const seen = new Set<string>();
  const collections = collectionsByLocale[locales.indexOf(lang)] ?? [];
  const candidates = collections.flatMap(
    ({ id, slug, title }): SuggestionCandidate[] => {
      const name = normalizeSearchText(title);
      if (!name || seen.has(name)) {
        return [];
      }
      seen.add(name);
      const titles = (titlesById.get(id) ?? []).map(item => item.title);
      return [
        {
          suggestion: { slug, label: title },
          text: normalizeSearchText([...titles, slug].join(' ')),
        },
      ];
    },
  );

  return {
    products: items,
    suggestions: rankSuggestions(candidates, parsed.tokens),
    total,
  };
}
