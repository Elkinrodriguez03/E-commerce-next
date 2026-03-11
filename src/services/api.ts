import { API_ENDPOINTS } from '@/constants';
import { Product } from '@/types';

export class ApiService {
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }
}
