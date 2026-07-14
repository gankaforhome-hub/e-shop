import '@/shared/styles/global.css';
import { Footer } from '@/widgets/layout/footer';

import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
});

const lora = Lora({
  variable: '--font-lora',
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
});

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
//   // Also supported but less commonly used
//   // interactiveWidget: 'resizes-visual',
//   colorScheme: 'dark',
// };

export const metadata: Metadata = {
  title: 'Ganka for Home',
  description: 'E-shop Ganka for Home',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lora.variable} m-0 grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] antialiased lg:grid-rows-[auto_1fr_auto]`}
      >
        {/* <Header /> */}
        <main>{children}</main>
        <Footer />
        <div id="modal-root" />
      </body>
    </html>
  );
}
