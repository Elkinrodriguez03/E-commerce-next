import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import CheckoutSideMenu from '@/components/checkoutSideMenu';
import AuthSuccessToast from '@/components/authSuccessToast';
import './globals.css';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'E-Commerce Shop',
  description: 'E-commerce application built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="mt-20">{children}</main>
          <CheckoutSideMenu />
          <Suspense fallback={null}>
            <AuthSuccessToast />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
