import { z } from 'zod';

import {
  type AdminBanner,
  type BannerLinkType,
  type BannerLocale,
} from '@/entities/banner';
import { type Media } from '@/entities/media';

import { isoToKyivLocal, kyivLocalToIso } from '../lib/kyiv-time';

//INFO Mirrors backend `CreateBannerDto`: the link matches its type, a URL slide has a uk title,
//INFO texts ≤ 150 / 80 / 40, url ≤ 500 (an internal path or an http(s) link), the schedule ends
//INFO after it starts. Messages are keys of `banners.errors`.

export type BannerErrorKey =
  | 'required'
  | 'tooLong'
  | 'invalidUrl'
  | 'collectionRequired'
  | 'titleRequired'
  | 'imageRequired'
  | 'invalidSchedule'
  | 'mediaNotFound'
  | 'collectionNotFound'
  | 'forbidden'
  | 'notFound'
  | 'tooManyRequests'
  | 'serverError';

export const BANNER_LOCALES = [
  'uk',
  'en',
] as const satisfies readonly BannerLocale[];

// "//host" is another site, not a path
const URL_PATTERN = /^(\/(?!\/)\S*|https?:\/\/\S+)$/;

const textSchema = z.object({
  title: z.string().trim().max(150, 'tooLong'),
  subtitle: z.string().trim().max(80, 'tooLong'),
  ctaLabel: z.string().trim().max(40, 'tooLong'),
});

type TextValues = z.output<typeof textSchema>;

// The form keeps the whole media object for the preview; only its id is sent
const mediaValue = z.custom<Media>(
  value => typeof value === 'object' && value !== null && 'id' in value,
);

export const bannerFormSchema = z
  .object({
    linkType: z.enum(['COLLECTION', 'URL']),
    /** `''` = none chosen */
    collectionId: z.string(),
    url: z.string().trim().max(500, 'tooLong'),
    image: mediaValue.nullable(),
    isActive: z.boolean(),
    /** `YYYY-MM-DDTHH:mm` in Kyiv, `''` = no limit */
    startsAt: z.string(),
    endsAt: z.string(),
    translations: z.object({ uk: textSchema, en: textSchema }),
  })
  .superRefine((values, ctx) => {
    const issue = (path: (string | number)[], message: BannerErrorKey) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

    if (!values.image) {
      issue(['image'], 'imageRequired');
    }
    if (values.linkType === 'COLLECTION' && !values.collectionId) {
      issue(['collectionId'], 'collectionRequired');
    }
    if (values.linkType === 'URL') {
      if (!values.url) {
        issue(['url'], 'required');
      } else if (!URL_PATTERN.test(values.url)) {
        issue(['url'], 'invalidUrl');
      }
      if (!values.translations.uk.title) {
        issue(['translations', 'uk', 'title'], 'titleRequired');
      }
    }
    const startsAt = kyivLocalToIso(values.startsAt);
    const endsAt = kyivLocalToIso(values.endsAt);
    if (startsAt && endsAt && endsAt <= startsAt) {
      issue(['endsAt'], 'invalidSchedule');
    }
  });

export type BannerFormInput = z.input<typeof bannerFormSchema>;
export type BannerFormValues = z.output<typeof bannerFormSchema>;

/** What the Server Actions send: `CreateBannerDto` / `UpdateBannerDto`. */
export const bannerInputSchema = z.object({
  linkType: z.enum(['COLLECTION', 'URL']),
  collectionId: z.string().uuid().nullable(),
  url: z.string().regex(URL_PATTERN).max(500).nullable(),
  imageId: z.string().uuid(),
  isActive: z.boolean(),
  startsAt: z.string().datetime().nullable(),
  endsAt: z.string().datetime().nullable(),
  translations: z
    .array(
      z.object({
        languageCode: z.enum(BANNER_LOCALES),
        title: z.string().max(150).nullable(),
        subtitle: z.string().max(80).nullable(),
        ctaLabel: z.string().max(40).nullable(),
      }),
    )
    .max(BANNER_LOCALES.length),
});

export type BannerInput = z.input<typeof bannerInputSchema>;

const emptyText: TextValues = { title: '', subtitle: '', ctaLabel: '' };

/** Form values of an existing banner, or of a new collection slide. */
export function toBannerFormValues(banner?: AdminBanner): BannerFormInput {
  const textOf = (locale: BannerLocale): TextValues => {
    const row = banner?.translations.find(item => item.languageCode === locale);
    return row
      ? {
          title: row.title ?? '',
          subtitle: row.subtitle ?? '',
          ctaLabel: row.ctaLabel ?? '',
        }
      : emptyText;
  };

  return {
    linkType: banner?.linkType ?? 'COLLECTION',
    collectionId: banner?.collection?.id ?? '',
    url: banner?.url ?? '',
    image: banner?.image ?? null,
    isActive: banner?.isActive ?? false,
    startsAt: isoToKyivLocal(banner?.startsAt ?? null),
    endsAt: isoToKyivLocal(banner?.endsAt ?? null),
    translations: { uk: textOf('uk'), en: textOf('en') },
  };
}

/** Validated form values → request body; empty texts become null (the fallbacks apply). */
export function toBannerInput(values: BannerFormValues): BannerInput {
  const linkType: BannerLinkType = values.linkType;

  return {
    linkType,
    collectionId: linkType === 'COLLECTION' ? values.collectionId : null,
    url: linkType === 'URL' ? values.url : null,
    // The schema refuses a form without an image before this runs
    imageId: values.image?.id ?? '',
    isActive: values.isActive,
    startsAt: kyivLocalToIso(values.startsAt),
    endsAt: kyivLocalToIso(values.endsAt),
    translations: BANNER_LOCALES.map(languageCode => {
      const { title, subtitle, ctaLabel } = values.translations[languageCode];
      return {
        languageCode,
        title: title || null,
        subtitle: subtitle || null,
        ctaLabel: ctaLabel || null,
      };
    }),
  };
}
