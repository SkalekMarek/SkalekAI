import { ClerkClientProvider } from './ClerkClientProvider';
import { headers } from 'next/headers';
import './globals.css';

export const metadata = {
  title: 'Skalek AI',
  description: 'AI Chat Interface',
  icons: {
    icon: '/svg/logo.svg',
  },
};

export default async function RootLayout({ children }) {
  const headerList = await headers();
  return (
    <ClerkClientProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
          
          {/* Unified Syntax Highlighting CSS */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkClientProvider>
  );
}
