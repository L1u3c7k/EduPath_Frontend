import axios from "axios";
import api from "./api";

const API_URL = import.meta.env.VITE_MENTORA_BACKEND;

export const signupApi = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const refreshAccessTokenApi = async () => {
  // Use raw axios here so request interceptors DON'T attach the expired token!
  const response = await axios.post(
    `${API_URL}/auth/refresh_token`,
    {},
    { withCredentials: true } // Only send the HttpOnly Cookie
  );

  console.log("✅ Refresh success:", response.data);
  return response.data.access_token;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
};
