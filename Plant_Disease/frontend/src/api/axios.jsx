import axios from 'axios';
import { refreshAccessToken } from '../../utils/refreshToken';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  // withCredentials: true,  // enable if you switch to cookie-based auth
});

// Add the access token to every request if available
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    console.log('Interceptor caught error:', error.response?.status);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 detected, trying to refresh token...');
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        console.log('Token refreshed:', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.log('Refresh token failed, logging out');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default instance;
