import { Inter, Lora } from 'next/font/google';

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
