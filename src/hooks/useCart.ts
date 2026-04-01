import { useState } from 'react';
import { CartItem, Order } from '@/types';
import { formatDateTime, totalPrice } from '@/utils';

export const useCart = () => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [counter, setCounter] = useState(0);
  const [order, setOrder] = useState<Order[]>([]);

  const addProductsToCart = (event: React.MouseEvent, productData: CartItem) => {
    event.stopPropagation();
    setCartProducts([...cartProducts, productData]);
    setCounter(counter + 1);
  };

  const removeProductFromCart = (id: number | string) => {
    const updatedCart = cartProducts.filter(product => product.id !== id);
    setCartProducts(updatedCart);
    setCounter(Math.max(0, counter - 1));
  };

  const handleCheckout = () => {
    const orderToAdd: Order = {
      id: crypto.randomUUID(),
      date: formatDateTime(),
      products: cartProducts,
      totalProducts: cartProducts.length,
      totalPrice: totalPrice(cartProducts),
    };

    // Decrement stock for seller products (string UUIDs, not numeric FakeStore IDs)
    const sellerItems = cartProducts
      .filter(p => typeof p.id === 'string')
      .map(p => ({ productId: String(p.id), quantity: p.quantity || 1 }));

    if (sellerItems.length > 0) {
      fetch('/api/products/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: sellerItems }),
      }).catch(() => {});
    }

    setOrder([...order, orderToAdd]);
    setCartProducts([]);
    setCounter(0);
  };

  const clearCart = () => {
    setCartProducts([]);
    setCounter(0);
  };

  return {
    cartProducts,
    setCartProducts,
    counter,
    setCounter,
    order,
    setOrder,
    addProductsToCart,
    removeProductFromCart,
    handleCheckout,
    clearCart,
  };
};
