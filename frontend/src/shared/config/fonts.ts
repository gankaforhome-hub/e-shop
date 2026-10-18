import { Noto_Sans, Playfair_Display } from 'next/font/google';

export const noto = Noto_Sans({
  variable: '--font-noto',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

/** Collection card titles only (`font-display`): one weight, not preloaded site-wide. */
export const playfair = Playfair_Display({
  variable: '--font-playfair',
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
  preload: false,
});
