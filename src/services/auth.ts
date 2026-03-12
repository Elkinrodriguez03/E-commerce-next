import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class AuthService {
  // --- Session management (localStorage) ---

  static setSession(token: string, user: User): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static clearSession(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // --- Server-side auth API calls ---

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      const userData: User = { email: data.user.email, name: data.user.name };
      this.setSession(data.token, userData);

      return { success: true, user: userData, token: data.token };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      const userData: User = { email: data.user.email, name: data.user.name };
      this.setSession(data.token, userData);

      return { success: true, user: userData, token: data.token };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async validateSession(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        this.clearSession();
        return null;
      }

      const profile = await res.json();
      const userData: User = { email: profile.email, name: profile.name };
      // Refresh cached user data
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return userData;
    } catch {
      this.clearSession();
      return null;
    }
  }

  static logout(): void {
    this.clearSession();
  }

  static init(): void {
    // No-op: server handles user seeding via `prisma db seed`
  }
}
