import { z } from 'zod';

import { type AppRoutes, type ExternalHref } from '@/shared/config/routes';
import { locales, type Locale } from '@/shared/i18n/routing';
import { type IconName } from '@/shared/types';

export const iconNameSchema = z.string() as z.ZodType<IconName>;

export const hrefSchema = z.string() as z.ZodType<AppRoutes | ExternalHref>;

export const navItemSchema = z.object({
  href: hrefSchema,
  label: z.string(),
  icon: iconNameSchema,
});

export const navListSchema = z.array(navItemSchema);
export type NavItem = z.infer<typeof navItemSchema>;

export const paymentMethodItemSchema = z.object({
  label: z.string(),
  icon: iconNameSchema,
});

export const paymentMethodListSchema = z.array(paymentMethodItemSchema);
export type PaymentMethodItem = z.infer<typeof paymentMethodItemSchema>;

export const navigationDictSchema = z.object({
  main: z.object({
    collections: z.string(),
    allCollections: z.string(),
    allProducts: z.string(),
    about: z.string(),
    exclusive: z.string(),
    releases: z.string(),
  }),
  help: z.object({
    contacts: z.string(),
    faq: z.string(),
    payments: z.string(),
    delivery: z.string(),
    returns: z.string(),
  }),
  legal: z.object({
    terms_conditions: z.string(),
    privacy_policy: z.string(),
    cookie_policy: z.string(),
  }),
});

const supportedLocalesSet = new Set<string>(locales);

export const languageItemSchema = z.object({
  codeTitle: z.string(),
  codeLabel: z.string(),
  ariaLabel: z.string(),
});

export type LanguageItem = z.infer<typeof languageItemSchema>;

export const languagesDictSchema = z
  .object({
    title: z.string().default('Select Language'),
    subTitle: z.string().default('Choose your preferred interface language'),
    options: z.record(z.string(), languageItemSchema),
  })
  .transform(data => ({
    title: data.title,
    subTitle: data.subTitle,
    options: Object.entries(data.options)
      .filter(([code]) => supportedLocalesSet.has(code))
      .map(([code, item]) => ({
        code: code as Locale,
        codeTitle: item.codeTitle,
        codeLabel: item.codeLabel,
        ariaLabel: item.ariaLabel,
      })),
  }));

export type LanguagesDict = z.infer<typeof languagesDictSchema>;

export const commonDictionarySchema = z
  .object({
    navigation: navigationDictSchema,
    contacts: z.array(navItemSchema),
    paymentMethods: z.array(paymentMethodItemSchema),
    social: z.array(navItemSchema),
    languages: languagesDictSchema,
  })
  .passthrough();

export function parseCommonDictionary(rawCommon: unknown) {
  return commonDictionarySchema.parse(rawCommon);
}
