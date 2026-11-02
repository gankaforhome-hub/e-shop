/**
 * Static logo sprite (`public/images/logo-sprite.svg`, cache headers in
 * `next.config.ts`): ~60 KB of paths stay out of every page's HTML, RSC
 * payload and client JS, and are cached across pages and visits.
 */
export const LOGO_SPRITE_URL = '/images/logo-sprite.svg';

/**
 * `id`s of the logo `<symbol>`s in `LOGO_SPRITE_URL`;
 * `LogoIcon` / `LogoTextIcon` reference them with `<use href="…#id">`.
 */
export const LOGO_SYMBOL_IDS = {
  mark: 'ganka-logo-mark',
  text: 'ganka-logo-text',
} as const;
