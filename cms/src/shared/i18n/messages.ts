import 'server-only';

import type uk from '@/dictionaries/uk.json';

import { type Locale } from './routing';
import { type Dictionary } from './types';

type SameShape<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false;
type AssertTrue<T extends true> = T;

/** Both dictionaries must have identical keys: a missing or extra key in `uk.json` fails `check-types`. */
export type DictionariesInSync = AssertTrue<SameShape<typeof uk, Dictionary>>;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import('@/dictionaries/uk.json').then(module => module.default),
  en: () => import('@/dictionaries/en.json').then(module => module.default),
};

export function loadMessages(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
