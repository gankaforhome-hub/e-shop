// declare global {
//   interface IntlMessages extends RawDictionarySchemas {}
// }

import type { RawDictionarySchemas } from '@/shared/i18n/types'; // ваш шлях

// Допоміжний тип, який перетворює Array<T> на Record<string, T>, щоб next-intl не вибивало
type CleanDictionary<T> =
  T extends Array<infer U>
    ? Record<string, CleanDictionary<U>>
    : T extends object
      ? { [K in keyof T]: CleanDictionary<T[K]> }
      : T;

declare module 'next-intl' {
  interface AppConfig {
    Messages: CleanDictionary<RawDictionarySchemas>;
  }
}
