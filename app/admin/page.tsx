'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import type { SellerProduct, SellerDashboardStats } from '@/types';
import { Package, PackageCheck, FileText, Warehouse, Plus, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthContext();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = AuthService.getToken();
      if (!token) return;
      try {
        const res = await fetch('/api/seller/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setProducts(await res.json());
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user?.role === 'SELLER') fetchProducts();
  }, [isAuthenticated, user]);

  const stats: SellerDashboardStats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'ACTIVE').length,
    draftProducts: products.filter(p => p.status === 'DRAFT').length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
  };

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-gray-900' },
    { label: 'Active', value: stats.activeProducts, icon: PackageCheck, color: 'text-emerald-600' },
    { label: 'Drafts', value: stats.draftProducts, icon: FileText, color: 'text-yellow-600' },
    { label: 'Total Stock', value: stats.totalStock, icon: Warehouse, color: 'text-blue-600' },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
            Welcome back, {user?.name || 'Seller'}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-5 w-5 text-gray-400" strokeWidth={1.8} />
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${card.color}`}>
                {loading ? '—' : card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Products</h2>
          <Link
            href="/admin/products"
            className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
        ) : recentProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-500">No products yet</p>
            <p className="text-xs text-gray-400 mt-1">
              <Link href="/admin/products/new" className="text-emerald-600 hover:underline">
                Add your first product
              </Link>{' '}
              to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-xs text-gray-500 text-left border-b border-gray-100">
                  <th className="px-4 sm:px-5 py-3 font-medium">Product</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Status</th>
                  <th className="px-4 sm:px-5 py-3 font-medium text-right">Price</th>
                  <th className="px-4 sm:px-5 py-3 font-medium text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 sm:px-5 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-9 h-9 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px] hover:text-emerald-600 transition-colors">
                          {product.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 sm:px-5 py-3">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right text-gray-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <span
                        className={
                          product.stock <= 0
                            ? 'text-red-500 font-medium'
                            : product.stock < 5
                              ? 'text-orange-500'
                              : 'text-gray-600'
                        }
                      >
                        {product.stock}
                      </span>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status] || styles.DRAFT}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
