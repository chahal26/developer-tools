import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";


export const metadata: Metadata = {
  title: {
    default: 'DevTools - Essential Developer Utilities',
    template: '%s | DevTools'
  },
  description: 'Collection of powerful developer tools including JSON validator, Markdown preview, Base64 encoder, and more. Boost your productivity with our free online utilities.',
  keywords: [
    'developer tools',
    'JSON validator',
    'Markdown preview',
    'Base64 encoder',
    'regex tester',
    'code formatter',
    'online utilities'
  ],
  authors: [{ name: 'Sahil Chahal', url: 'https://github.com/chahal26' }],
  creator: 'Sahil Chahal',
  publisher: 'Magnus Galaxy',
  metadataBase: new URL('https://developer-tools-phi.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DevTools - Essential Developer Utilities',
    description: 'Free online developer tools to streamline your workflow',
    url: 'https://developer-tools-phi.vercel.app',
    siteName: 'DevTools',
    images: [
      {
        url: 'https://developer-tools-phi.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools - Essential Developer Utilities',
    description: 'Free online developer tools to streamline your workflow',
    creator: '@yourtwitter',
    images: ['https://developer-tools-phi.vercel.app/twitter-card.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
