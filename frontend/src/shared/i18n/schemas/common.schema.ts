import { z } from 'zod';

import { type AppRoutes, type ExternalHref } from '@/shared/config/routes';
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

export const commonDictionarySchema = z
  .object({
    navigation: navigationDictSchema, // 👈 Додали navigation
    contacts: z.array(navItemSchema),
    paymentMethods: z.array(paymentMethodItemSchema),
    social: z.array(navItemSchema),
  })
  .passthrough();

export function parseCommonDictionary(rawCommon: unknown) {
  return commonDictionarySchema.parse(rawCommon);
}
