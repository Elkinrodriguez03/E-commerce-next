import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ApiService } from '@/services/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useProducts = () => {
  const [items, setItems] = useState<Product[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch both sources in parallel
        const [fakeStoreProducts, sellerProductsRes] = await Promise.allSettled([
          ApiService.getProducts(),
          fetch(`${API_URL}/api/products`).then(res => (res.ok ? res.json() : [])),
        ]);

        const fakeStore = fakeStoreProducts.status === 'fulfilled' ? fakeStoreProducts.value : [];
        const seller = sellerProductsRes.status === 'fulfilled' ? sellerProductsRes.value : [];

        setItems([...fakeStore, ...seller]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { items, loading, error, setItems };
};
