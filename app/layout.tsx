import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Treehouse Form Builder',
  description: 'Form builder tool for Treehouse Production team',
  icons: {
    icon: 'https://cdn.treehouseinternetgroup.com/cms_images/687/th-mkg-favicon.ico',
  },
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';
