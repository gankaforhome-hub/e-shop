import { Inter, Lora, Noto_Sans, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

export const lora = Lora({
  variable: '--font-lora',
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
});

export const noto = Noto_Sans({
  variable: '--font-noto',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

export const playfair = Playfair_Display({
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});
