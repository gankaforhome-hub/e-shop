import { type AdminBanner, type BannerLinkTarget } from '../model/types';

const targetTitle = (target: BannerLinkTarget, locale: string) =>
  target.translations.find(item => item.languageCode === locale)?.title ??
  target.translations.find(item => item.languageCode === 'uk')?.title;

/**
 * The title the storefront shows in `locale`: the slide's own (in `locale`, then uk), else its
 * collection's. Mirrors the backend fallback.
 */
export function getBannerTitle(banner: AdminBanner, locale: string): string {
  const own = (code: string) =>
    banner.translations.find(item => item.languageCode === code)?.title;

  return (
    own(locale) ??
    own('uk') ??
    (banner.collection ? targetTitle(banner.collection, locale) : undefined) ??
    banner.url ??
    ''
  );
}

/** A link target's name in `locale`, else uk, else its slug. */
export const getLinkTargetTitle = (target: BannerLinkTarget, locale: string) =>
  targetTitle(target, locale) ?? target.slug;
