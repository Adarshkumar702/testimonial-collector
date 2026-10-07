import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Automatically sends httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor: Handle 401 & automatic token refresh via httpOnly cookies
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite refresh loop on auth endpoints
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/signup') &&
      !originalRequest.url.includes('/auth/forgot-password') &&
      !originalRequest.url.includes('/auth/reset-password')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Post to refresh token endpoint - browser sends refreshToken httpOnly cookie automatically
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        processQueue(null);
        // Retry original request - browser sends new accessToken httpOnly cookie automatically
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
