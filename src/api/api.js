import axios from "axios";


// Axios lives outside React, so these handlers are bound from AuthContext.
// The access token itself is stored in React state, not here.
let getAccessToken = () => null;
let syncAccessToken = () => { };
let onUnauthorized = () => { };

export const configureAuthHandlers = ({ getToken, setToken, onUnauthorized: handleUnauthorized }) => {
  getAccessToken = getToken;
  syncAccessToken = setToken;
  onUnauthorized = handleUnauthorized;
};
const API_URL = import.meta.env.VITE_MENTORA_BACKEND;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Sends HttpOnly Cookie (Refresh Token) automatically
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(`📤 Sending request to [${config.url}] with token:`, accessToken);
    } else {
      console.log(`📤 Sending request to [${config.url}] WITHOUT token`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup") &&
      !originalRequest.url?.includes("/auth/refresh_token")
    ) {
      console.warn(`⚠️ Request to [${originalRequest.url}] failed with 401 (Token Expired). Attempting refresh...`);
      originalRequest._retry = true;

      try {
        const { refreshAccessTokenApi } = await import("./authApi");
        const newAccessToken = await refreshAccessTokenApi();

        console.log("✅ Received new access token:", newAccessToken);
        syncAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(`🔄 Retrying original request to [${originalRequest.url}] with new token.`);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed. User will be logged out:", refreshError);
        syncAccessToken(null);
        onUnauthorized();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
