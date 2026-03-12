import { apiClient } from '@/services/apiClient';

// User CRUD functions
export const userService = {
  // Get all users
  async getAllUsers() {
    return apiClient.get('/users');
  },

  // Get user by ID
  async getUserById(id: string) {
    return apiClient.get(`/users/${id}`);
  },

  // Create new user
  async createUser(userData: { email: string; name: string; password: string }) {
    return apiClient.post('/users', userData);
  },

  // Update user
  async updateUser(
    id: string,
    userData: {
      email?: string;
      name?: string;
      password?: string;
    }
  ) {
    return apiClient.put(`/users/${id}`, userData);
  },

  // Delete user
  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`);
  },

  // Get current user profile
  async getCurrentUser() {
    return apiClient.get('/users/profile');
  },

  // Update current user profile
  async updateProfile(userData: { name?: string; email?: string; password?: string }) {
    return apiClient.put('/users/profile', userData);
  },
};
