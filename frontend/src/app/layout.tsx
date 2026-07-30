import type { Metadata } from 'next';

import React from 'react';

import { inter, lora } from '@/shared/config';
import '@/shared/styles/global.css';
import { Footer } from '@/widgets/layout/footer'; // export const viewport: Viewport = {
import { Header } from '@/widgets/layout/header';
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
        {/* <Section className="bg-surface-muted pb-4">
          <Container className="py-auto h-var(--h-topbar) flex w-full items-center justify-center">
            <AppLink href={routes.home} className="link">
              <Heading
                headingLevel="h1"
                className="text-brand-primary text-center"
              >
                Ganka for Home
              </Heading>
            </AppLink>
          </Container>
        </Section> */}
        <Header />
        <main>{children}</main>
        <Footer />
        <div id="modal-root" />
      </body>
    </html>
  );
}
