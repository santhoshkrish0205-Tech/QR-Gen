import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QrProvider } from '@/lib/qr-context';
import { MenuProvider } from '@/lib/menu-context';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ShopQR — Business QR Platform for Restaurants',
  description:
    'Create a digital menu for your restaurant in minutes. Customers scan one QR, never print again. Change prices live.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <QrProvider>
          <MenuProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </MenuProvider>
        </QrProvider>
      </body>
    </html>
  );
}
