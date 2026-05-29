'use client';

import Link from 'next/link';
import { useProductContext } from '@/context';
import { Order } from '@/types';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

function MyOrders() {
  const { order } = useProductContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {order.length} {order.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {order.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No orders yet</p>
            <p className="text-xs text-gray-500 mb-4">
              When you place an order, it will appear here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders list */
          <div className="space-y-3">
            {order.map((o: Order, index: number) => (
              <Link
                key={index}
                href={`/my-orders/${index}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                  <Package className="h-5 w-5 text-gray-600" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">Order #{index + 1}</p>
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-green-50 text-green-700 rounded-md shrink-0">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {o.totalProducts} {o.totalProducts === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{o.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">${o.totalPrice}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
