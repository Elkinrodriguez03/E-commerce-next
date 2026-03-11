import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ApiService } from '@/services/api';

export const useProducts = () => {
  const [items, setItems] = useState<Product[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await ApiService.getProducts();
        setItems(products);
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
