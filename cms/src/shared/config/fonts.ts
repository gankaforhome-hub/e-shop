import { Noto_Sans } from 'next/font/google';

/** Same family as the storefront (`font-sans`). */
export const noto = Noto_Sans({
  variable: '--font-noto',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});
