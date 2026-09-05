import axios from "axios";
import { refreshAccessTokenApi } from "./authApi"; // Import your raw refresh function

let getAccessToken = () => null;
let syncAccessToken = () => {};
let onUnauthorized = () => {};

export const configureAuthHandlers = ({ getToken, setToken, onUnauthorized: handleUnauthorized }) => {
  getAccessToken = getToken;
  syncAccessToken = setToken;
  onUnauthorized = handleUnauthorized;
};

const API_URL = import.meta.env.VITE_MENTORA_BACKEND;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Queue management for concurrent 401 responses
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh_token')
    ) {
      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        
        const newAccessToken = await refreshAccessTokenApi();
        
        
        syncAccessToken(newAccessToken);

        // 2. Attach new token to the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 3. Resolve queued requests
        processQueue(null, newAccessToken);

        // 4. Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        onUnauthorized(); 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;