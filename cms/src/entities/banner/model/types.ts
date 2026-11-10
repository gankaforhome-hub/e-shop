import { type Media } from '@/entities/media';

/*
 * Responses of `/admin/banners`, written by hand from Swagger
 * (backend `modules/banner/responses/banner.response.ts`). Dates arrive as ISO strings.
 */

export type BannerLocale = 'uk' | 'en';

export type BannerLinkType = 'COLLECTION' | 'URL';

/** live: on the storefront now; hidden: switched off; scheduled / expired: outside its dates */
export type BannerStatus = 'live' | 'hidden' | 'scheduled' | 'expired';

/** `BannerTextResponse`: every text optional (fallbacks on the storefront). */
export type BannerText = {
  languageCode: BannerLocale;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
};

/** `BannerLinkTargetResponse`: a collection a slide can link to. */
export type BannerLinkTarget = {
  id: string;
  slug: string;
  /** Hidden collections are listed, but their slides don't show */
  isActive: boolean;
  /** uk first */
  translations: { languageCode: BannerLocale; title: string }[];
};

/** `AdminBannerResponse` */
export type AdminBanner = {
  id: string;
  linkType: BannerLinkType;
  collection: BannerLinkTarget | null;
  url: string | null;
  image: Media;
  isActive: boolean;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
  status: BannerStatus;
  /** uk first */
  translations: BannerText[];
  createdAt: string;
  updatedAt: string;
};
