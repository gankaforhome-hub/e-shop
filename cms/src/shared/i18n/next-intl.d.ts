import { type routing } from './routing';
import { type Dictionary } from './types';

// Typed `useTranslations` / `getTranslations` keys and `useLocale()`
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Dictionary;
  }
}
