'use client';

import Link from 'next/link';
import { useProductContext } from '@/context';
import { CartItem } from '@/types';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';

function MyLastOrder() {
  const { order } = useProductContext();
  const lastIndex = order.length - 1;
  const currentOrder = order?.[lastIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex items-center gap-3">
            <Link
              href="/my-orders"
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Back to orders"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Latest Order</h1>
              {currentOrder && <p className="text-sm text-gray-500 mt-0.5">{currentOrder.date}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* Success banner */}
        {currentOrder && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Order placed successfully</p>
              <p className="text-xs text-green-700 mt-0.5">
                {currentOrder.totalProducts} {currentOrder.totalProducts === 1 ? 'item' : 'items'} •
                Total: ${currentOrder.totalPrice}
              </p>
            </div>
          </div>
        )}

        {/* Products list */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
            Items
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {currentOrder?.products.map((product: CartItem) => (
              <div key={product.id} className="flex items-center gap-3.5 p-4">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</p>
                  {product.quantity && (
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {product.quantity}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/my-orders"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Package className="h-4 w-4" />
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyLastOrder;
