import { z } from 'zod';

import type { RawDictionarySchemas } from '@/shared/i18n/types';

import { hrefSchema } from './common.schema';

export const stockistSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  address: z.string(),
  city: z.string(),
  mapUrl: hrefSchema,
});
export type Stockist = z.infer<typeof stockistSchema>;

export const contactsDictionarySchema = z
  .object({
    stockists: z.object({ items: z.array(stockistSchema) }).passthrough(),
  })
  .passthrough();

/** Narrows JSON strings to typed hrefs (`mapUrl`) for `AppLink`. */
export function parseContactsDictionary(
  rawContacts: RawDictionarySchemas['contacts'],
) {
  const parsed = contactsDictionarySchema.parse(rawContacts);
  return {
    ...rawContacts,
    stockists: { ...rawContacts.stockists, items: parsed.stockists.items },
  };
}
