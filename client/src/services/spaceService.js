import api from './api';

export const spaceService = {
  async createSpace(formData) {
    const response = await api.post('/spaces', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getOwnerSpaces() {
    const response = await api.get('/spaces');
    return response.data;
  },

  async getSpaceById(id) {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },

  async updateSpace(id, formData) {
    const response = await api.put(`/spaces/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteSpace(id) {
    const response = await api.delete(`/spaces/${id}`);
    return response.data;
  },

  async checkSlug(slug, currentSpaceId) {
    const response = await api.get('/spaces/check-slug', {
      params: { slug, currentSpaceId }
    });
    return response.data;
  },

  // Public methods
  async getPublicSpace(spaceSlug) {
    const response = await api.get(`/public/spaces/${spaceSlug}`);
    return response.data;
  },

  async submitPublicTestimonial(spaceSlug, formData) {
    const response = await api.post(`/public/spaces/${spaceSlug}/testimonials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getPublicApprovedTestimonials(spaceSlug) {
    const response = await api.get(`/public/spaces/${spaceSlug}/approved`);
    return response.data;
  }
};
