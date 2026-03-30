'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import LoadingSpinner from '@/components/loadingSpinner';
import type { SellerProduct, SellerDashboardStats } from '@/types';
import { PlusIcon, CubeIcon, ArchiveBoxIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function SellerDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'SELLER')) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = AuthService.getToken();
      if (!token) return;

      try {
        const res = await fetch('/api/seller/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'SELLER') {
      fetchProducts();
    }
  }, [isAuthenticated, user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SELLER') return null;

  const stats: SellerDashboardStats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'ACTIVE').length,
    draftProducts: products.filter(p => p.status === 'DRAFT').length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name || 'Seller'}</p>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CubeIcon className="h-6 w-6" />}
          label="Total Products"
          value={stats.totalProducts}
        />
        <StatCard
          icon={<CubeIcon className="h-6 w-6 text-green-600" />}
          label="Active"
          value={stats.activeProducts}
          color="text-green-600"
        />
        <StatCard
          icon={<DocumentTextIcon className="h-6 w-6 text-yellow-600" />}
          label="Drafts"
          value={stats.draftProducts}
          color="text-yellow-600"
        />
        <StatCard
          icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
          label="Total Stock"
          value={stats.totalStock}
          color="text-blue-600"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Products</h2>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>}

        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CubeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm mt-1">
              Start by{' '}
              <Link href="/seller/products/new" className="text-emerald-600 hover:underline">
                adding your first product
              </Link>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded object-cover bg-gray-100"
                        />
                        <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="text-emerald-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color = 'text-gray-900',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-2">{icon}</div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    DRAFT: 'bg-yellow-100 text-yellow-700',
    ARCHIVED: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.DRAFT}`}
    >
      {status}
    </span>
  );
}

export default SellerDashboard;
