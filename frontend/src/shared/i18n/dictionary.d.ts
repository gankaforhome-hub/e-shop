import type { RawDictionarySchemas } from '@/shared/i18n/types';

declare global {
  interface IntlMessages extends RawDictionarySchemas {}
}

export {};
