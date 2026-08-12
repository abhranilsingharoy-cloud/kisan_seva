import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'KisanSeva — Smart Crop Advisory for Smallholder Farmers',
    template: '%s | KisanSeva'
  },
  description:
    'AI-powered crop disease detection, personalized irrigation schedules, live mandi price comparisons — accessible on any phone or even via SMS/IVR call.',
  keywords: [
    'crop disease detection', 'mandi price', 'smart farming', 'kisan advisory',
    'irrigation schedule', 'fertilizer recommendation', 'agritech India',
    'smallholder farmer app', 'krishi advisory', 'plant disease app'
  ],
  authors: [{ name: 'KisanSeva Team' }],
  creator: 'KisanSeva',
  publisher: 'KisanSeva',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kisanseva.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kisanseva.app',
    siteName: 'KisanSeva',
    title: 'KisanSeva — Smart Crop Advisory for Smallholder Farmers',
    description: 'AI crop disease detection, irrigation scheduling & live mandi prices.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KisanSeva App' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KisanSeva — Smart Crop Advisory',
    description: 'AI crop disease detection, irrigation scheduling & live mandi prices.',
    images: ['/og-image.png']
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }]
  }
}

export const viewport: Viewport = {
  themeColor: '#e8b672',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
