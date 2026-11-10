import { z } from 'zod';

import {
  type AdminCollection,
  type CollectionLocale,
} from '@/entities/collection';
import { type Media } from '@/entities/media';

//INFO Mirrors backend `CreateCollectionDto` / `CollectionTranslationDto`: slug kebab-case
//INFO ≤ 100, uk texts required, length limits. No skuPrefix: the API assigns three digits in
//INFO creation order. The home hero lives in banners (`content/banners`), not here.
//INFO Messages are keys of `collections.errors`.

export type CollectionErrorKey =
  | 'required'
  | 'tooLong'
  | 'invalidSlug'
  | 'invalidNumber'
  | 'translationIncomplete'
  | 'slugTaken'
  | 'skuPrefixExhausted'
  | 'seasonNotFound'
  | 'mediaNotFound'
  | 'forbidden'
  | 'notFound'
  | 'usedInBanners'
  | 'tooManyRequests'
  | 'serverError';

export const COLLECTION_LOCALES = [
  'uk',
  'en',
] as const satisfies readonly CollectionLocale[];

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** A language is either left empty or has all three of these. */
const REQUIRED_TEXTS = ['title', 'shortDescription', 'description'] as const;

const translationSchema = z.object({
  title: z.string().trim().max(150, 'tooLong'),
  shortDescription: z.string().trim(),
  description: z.string().trim(),
  metaTitle: z.string().trim().max(120, 'tooLong'),
  metaDescription: z.string().trim().max(320, 'tooLong'),
});

export type TranslationValues = z.output<typeof translationSchema>;

export const isTranslationEmpty = (translation: TranslationValues) =>
  Object.values(translation).every(value => value === '');

const coreShape = {
  slug: z
    .string()
    .trim()
    .min(1, 'required')
    .max(100, 'tooLong')
    .regex(SLUG_PATTERN, 'invalidSlug'),
  /** `''` = no season */
  seasonSlug: z.string().max(50, 'tooLong'),
  sortOrder: z
    .number({ invalid_type_error: 'invalidNumber' })
    .int('invalidNumber')
    .min(0, 'invalidNumber'),
  isActive: z.boolean(),
  translations: z.object({ uk: translationSchema, en: translationSchema }),
};

type CoreValues = {
  translations: Record<CollectionLocale, TranslationValues>;
};

function refineCollection({ translations }: CoreValues, ctx: z.RefinementCtx) {
  for (const locale of COLLECTION_LOCALES) {
    const translation = translations[locale];
    // uk is the storefront's fallback, so it is always required; en may stay empty
    if (locale !== 'uk' && isTranslationEmpty(translation)) {
      continue;
    }
    for (const field of REQUIRED_TEXTS) {
      if (!translation[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['translations', locale, field],
          message: locale === 'uk' ? 'required' : 'translationIncomplete',
        });
      }
    }
  }
}

// The form keeps whole media objects for the previews; only their ids are sent
const mediaValue = z.custom<Media>(
  value => typeof value === 'object' && value !== null && 'id' in value,
);

/** Client form: images as `Media`. */
export const collectionFormSchema = z
  .object({
    ...coreShape,
    coverImage: mediaValue.nullable(),
  })
  .superRefine(refineCollection);

/** What the Server Actions accept and check again: images as ids. */
export const collectionInputSchema = z
  .object({
    ...coreShape,
    coverImageId: z.string().uuid().nullable(),
  })
  .superRefine(refineCollection);

export type CollectionFormInput = z.input<typeof collectionFormSchema>;
export type CollectionFormValues = z.output<typeof collectionFormSchema>;
export type CollectionInput = z.input<typeof collectionInputSchema>;

const emptyTranslation: TranslationValues = {
  title: '',
  shortDescription: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
};

/** Form values of an existing collection, or of a new one. */
export function toFormValues(
  collection?: AdminCollection,
): CollectionFormInput {
  const translationOf = (locale: CollectionLocale): TranslationValues => {
    const row = collection?.translations.find(
      item => item.languageCode === locale,
    );
    return row
      ? {
          title: row.title,
          shortDescription: row.shortDescription,
          description: row.description,
          metaTitle: row.metaTitle ?? '',
          metaDescription: row.metaDescription ?? '',
        }
      : emptyTranslation;
  };

  return {
    slug: collection?.slug ?? '',
    seasonSlug: collection?.seasonSlug ?? '',
    sortOrder: collection?.sortOrder ?? 0,
    isActive: collection?.isActive ?? false,
    coverImage: collection?.coverImage ?? null,
    translations: { uk: translationOf('uk'), en: translationOf('en') },
  };
}

/** Validated form values → Server Action input. */
export const toCollectionInput = ({
  coverImage,
  ...values
}: CollectionFormValues): CollectionInput => ({
  ...values,
  coverImageId: coverImage?.id ?? null,
});
