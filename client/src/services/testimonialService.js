import api from './api';

export const testimonialService = {
  async getSpaceTestimonials(spaceId, params = {}) {
    const response = await api.get(`/testimonials/space/${spaceId}`, { params });
    return response.data;
  },

  async approve(id) {
    const response = await api.patch(`/testimonials/${id}/approve`);
    return response.data;
  },

  async reject(id) {
    const response = await api.patch(`/testimonials/${id}/reject`);
    return response.data;
  },

  async archive(id) {
    const response = await api.patch(`/testimonials/${id}/archive`);
    return response.data;
  },

  async toggleFeatured(id) {
    const response = await api.patch(`/testimonials/${id}/feature`);
    return response.data;
  },

  async toggleLiked(id) {
    const response = await api.patch(`/testimonials/${id}/like`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};
