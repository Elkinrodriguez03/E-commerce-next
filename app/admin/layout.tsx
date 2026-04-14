'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import LoadingSpinner from '@/components/loadingSpinner';
import AdminTopBar from './components/AdminTopBar';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'SELLER')) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SELLER') return null;

  return (
    <>
      {/* Hide the global buyer top bar, bottom tab bar, category nav, and checkout menu */}
      <style>{`
        body > div > header,
        body > div > nav,
        body > div > aside { display: none !important; }
        body > div > main {
          margin-top: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>

      <AdminTopBar onToggleSidebar={toggleSidebar} />
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="lg:ml-56 mt-14 min-h-[calc(100vh-3.5rem)] bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </main>
    </>
  );
}
