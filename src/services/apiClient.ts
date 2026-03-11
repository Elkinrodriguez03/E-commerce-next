import { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}/api${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Cart
  async getCart() {
    return this.fetch('/cart');
  }

  async addToCart(product: Product, quantity: number = 1) {
    return this.fetch('/cart', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        quantity,
        price: product.price,
        title: product.title,
        image: product.image,
        category: product.category,
      }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.fetch(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return this.fetch(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  // Checkout
  async checkout() {
    return this.fetch('/checkout', {
      method: 'POST',
    });
  }

  // Orders
  async getOrders() {
    return this.fetch('/orders');
  }

  // Generic HTTP methods
  async get(endpoint: string) {
    return this.fetch(endpoint);
  }

  async post<T>(endpoint: string, data: T) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: T) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.fetch(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
