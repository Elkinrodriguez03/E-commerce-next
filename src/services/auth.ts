import bcryptjs from 'bcryptjs';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const SALT_ROUNDS = 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  static generateToken(user: User): string {
    const payload = {
      email: user.email,
      name: user.name,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  static verifyToken(token: string): { email: string; name?: string; exp: number } | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

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
    const token = this.getToken();
    if (!token) return false;
    return this.verifyToken(token) !== null;
  }

  // Mock users storage (in production, this would be a backend API)
  private static getStoredUsers(): Array<{ email: string; passwordHash: string; name: string }> {
    const users = localStorage.getItem('registered_users');
    return users ? JSON.parse(users) : [];
  }

  private static storeUser(email: string, passwordHash: string, name: string): void {
    const users = this.getStoredUsers();
    users.push({ email, passwordHash, name });
    localStorage.setItem('registered_users', JSON.stringify(users));
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword = await this.verifyPassword(credentials.password, user.passwordHash);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    const userData: User = { email: user.email, name: user.name };
    const token = this.generateToken(userData);
    this.setSession(token, userData);

    return { success: true, user: userData, token };
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const users = this.getStoredUsers();

    if (users.some(u => u.email === credentials.email)) {
      return { success: false, error: 'Email already registered' };
    }

    const passwordHash = await this.hashPassword(credentials.password);
    this.storeUser(credentials.email, passwordHash, credentials.name);

    const userData: User = { email: credentials.email, name: credentials.name };
    const token = this.generateToken(userData);
    this.setSession(token, userData);

    return { success: true, user: userData, token };
  }

  static logout(): void {
    this.clearSession();
  }

  static init(): void {
    // Initialize with a demo user for testing
    const users = this.getStoredUsers();
    if (users.length === 0) {
      const demoPasswordHash = bcryptjs.hashSync('password123', SALT_ROUNDS);
      this.storeUser('demo@ecommerce.com', demoPasswordHash, 'Demo User');
    }
  }
}
