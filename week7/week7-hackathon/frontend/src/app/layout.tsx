import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'POS System — Raw Material Based',
  description:
    'A production-style Point of Sale system where products are manufactured from raw materials. Stock is dynamically calculated.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#252836' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
