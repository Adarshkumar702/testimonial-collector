import api from './api';

export const authService = {
  async signup(data) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async verifyEmail(data) {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async forgotPassword(data) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
