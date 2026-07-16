import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QrProvider } from '@/lib/qr-context';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ShopQR Pro — Everything your customers need. One QR platform.',
  description:
    'Empower your business with dynamic QR codes that drive sales, gather reviews, and simplify payments.',
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <QrProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </QrProvider>
      </body>
    </html>
  );
}
