import { Noto_Sans, Playfair_Display } from 'next/font/google';

export const noto = Noto_Sans({
  variable: '--font-noto',
  // Only the weights in use (normal/medium/semibold/bold): each one is a font file
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

/** Collection card titles only (`font-display`): one weight, not preloaded site-wide. */
export const playfair = Playfair_Display({
  variable: '--font-playfair',
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
  preload: false,
});
