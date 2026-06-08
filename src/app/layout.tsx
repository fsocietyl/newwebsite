import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';

const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const fontSans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const fontArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Sign Foreign Trade — Luxury Interiors',
  description:
    'Sign Foreign Trade (Sign Dış Ticaret) curates premium furniture, bespoke collections, and architectural projects across global residences.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Sign Foreign Trade — Luxury Interiors',
    description:
      'Sign Foreign Trade (Sign Dış Ticaret) curates premium furniture, bespoke collections, and architectural projects across global residences.',
    images: ['/images/hero-1.svg'],
    type: 'website',
  },
  icons: {
    icon: [{ url: '/favicon-sign.ico' }, { url: '/favicon-32.png', type: 'image/png' }],
    shortcut: '/favicon-sign.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontDisplay.variable} ${fontSans.variable} ${fontArabic.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
