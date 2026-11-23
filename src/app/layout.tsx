import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simulateur & Devis Instantané | JAAD Studio',
  applicationName: 'JAAD Devis',
  description:
    'Composez votre projet Web, Boutique en ligne, Boost Google ou Outil IA sur-mesure en 60 secondes. Tarifs transparents en direct et devis PDF immédiat.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'JAAD Devis',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-jaad-canvas text-jaad-ink selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
