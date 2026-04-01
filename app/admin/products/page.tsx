'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context';
import { AuthService } from '@/services/auth';
import type { SellerProduct } from '@/types';
import { Plus, Package, Search } from 'lucide-react';

export default function AdminProducts() {
  const { user, isAuthenticated } = useAuthContext();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { label: 'All', value: 'ALL', count: products.length },
    { label: 'Active', value: 'ACTIVE', count: products.filter(p => p.status === 'ACTIVE').length },
    { label: 'Draft', value: 'DRAFT', count: products.filter(p => p.status === 'DRAFT').length },
    {
      label: 'Archived',
      value: 'ARCHIVED',
      count: products.filter(p => p.status === 'ARCHIVED').length,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Status tabs */}
        <div className="flex items-center gap-0 border-b border-gray-200 px-1 overflow-x-auto">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-1 sm:ml-1.5 text-xs text-gray-400">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-500">
              {search || statusFilter !== 'ALL'
                ? 'No products match your filters'
                : 'No products yet'}
            </p>
            {!search && statusFilter === 'ALL' && (
              <p className="text-xs text-gray-400 mt-1">
                <Link href="/admin/products/new" className="text-emerald-600 hover:underline">
                  Add your first product
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-xs text-gray-500 text-left border-b border-gray-100">
                  <th className="px-4 sm:px-5 py-3 font-medium">Product</th>
                  <th className="px-4 sm:px-5 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Status</th>
                  <th className="px-4 sm:px-5 py-3 font-medium text-right">Price</th>
                  <th className="px-4 sm:px-5 py-3 font-medium text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 sm:px-5 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <span className="font-medium text-gray-900 truncate max-w-[140px] sm:max-w-[250px] group-hover:text-emerald-600 transition-colors">
                          {product.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-gray-500 hidden md:table-cell">
                      {product.category}
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
