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
        <body>
          {children}
        </body>
      </html>
    </ClerkClientProvider>
  );
}
