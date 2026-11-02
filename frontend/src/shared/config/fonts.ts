import { Noto_Sans, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';

export const noto = Noto_Sans({
  variable: '--font-noto',
  // Only the weights in use (normal/medium/semibold/bold): each one is a font file
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

/**
 * Noto Sans hryvnia sign (₴) only, 1.6 KB. Listed before `noto` in the font
 * stacks (`global.css`), so prices don't pull Noto's 168 KB latin-ext file
 * for one glyph. No fallback face: other characters fall through to `noto`.
 */
export const notoHryvnia = localFont({
  src: '../assets/fonts/noto-sans-hryvnia.woff2',
  variable: '--font-noto-hryvnia',
  weight: '100 900',
  declarations: [{ prop: 'unicode-range', value: 'U+20B4' }],
  adjustFontFallback: false,
});

/** Collection card titles only (`font-display`): one weight, not preloaded site-wide. */
export const playfair = Playfair_Display({
  variable: '--font-playfair',
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
  preload: false,
});
