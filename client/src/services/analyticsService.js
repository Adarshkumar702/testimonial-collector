import api from './api';

export const analyticsService = {
  async getOverview() {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  async getSpaceAnalytics(spaceId) {
    const response = await api.get(`/analytics/space/${spaceId}`);
    return response.data;
  }
};
