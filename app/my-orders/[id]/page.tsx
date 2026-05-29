'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProductContext } from '@/context';
import { CartItem } from '@/types';
import { ArrowLeft, Package } from 'lucide-react';

function MyOrder() {
  const { order } = useProductContext();
  const params = useParams();
  const id = params.id as string;
  const orderIndex = parseInt(id, 10);
  const currentOrder = order?.[orderIndex];

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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Order #{orderIndex + 1}
              </h1>
              {currentOrder && <p className="text-sm text-gray-500 mt-0.5">{currentOrder.date}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* Order summary card */}
        {currentOrder && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <Package className="h-4.5 w-4.5 text-green-600" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500">
                    {currentOrder.totalProducts}{' '}
                    {currentOrder.totalProducts === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">${currentOrder.totalPrice}</p>
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

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/my-orders"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyOrder;
