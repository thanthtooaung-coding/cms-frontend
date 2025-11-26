import axios, { AxiosInstance } from 'axios';

let _apiClient: AxiosInstance | null = null;

export const setApiClient = (client: AxiosInstance) => {
  _apiClient = client;
};

export const getApiClient = (): AxiosInstance => {
  if (!_apiClient) {
    throw new Error('API client has not been initialized. Call setApiClient() first.');
  }
  return _apiClient;
};

export const createApiClient = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Add request interceptor to include Authorization header
  api.interceptors.request.use(
    (config) => {
      // Only add token if we're in a browser environment
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response
    // (error) => {
    //   if (typeof window !== 'undefined' && error.response?.status === 401) {
    //     window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    //   }
    //   return Promise.reject(error);
    // }
  );

  return api;
};
