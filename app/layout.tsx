import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { TopBar, MobileBottomTabBar } from '@/components/topBar';
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
          <TopBar />
          <main className="pb-bottom-tab md:pb-0">{children}</main>
          <MobileBottomTabBar />
          <CheckoutSideMenu />
          <Suspense fallback={null}>
            <AuthSuccessToast />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
