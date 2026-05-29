'use client';

import Link from 'next/link';
import { useProductContext } from '@/context';
import { Product } from '@/types';
import { Heart, ShoppingBag, X, Plus } from 'lucide-react';

function Favorites() {
  const { favorites, toggleFavorite, cartProducts, addToCart, removeFromCart } =
    useProductContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Favorites</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {favorites.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No favorites yet</p>
            <p className="text-xs text-gray-500 mb-4">
              Tap the heart icon on products you love to save them here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Favorites list */
          <div className="space-y-3">
            {favorites.map((product: Product) => {
              const isInCart = cartProducts.some(p => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3.5 bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                >
                  {/* Product image */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{product.category}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">${product.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {/* Add/remove from cart */}
                    <button
                      onClick={e => {
                        if (isInCart) {
                          removeFromCart(product.id);
                        } else {
                          addToCart(e, product);
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isInCart
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      aria-label={isInCart ? 'Remove from cart' : 'Add to cart'}
                    >
                      {isInCart ? (
                        <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Plus className="h-4 w-4" strokeWidth={2} />
                      )}
                    </button>

                    {/* Remove from favorites */}
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
