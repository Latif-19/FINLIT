// ─── Base API Client ─────────────────────────────────────────────────────────
// All domain services import from this shared axios instance. It automatically
// attaches the JWT to every request, and on a 401 it tries to refresh the token
// once before giving up and logging the user out.

import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { useUserStore } from "../store/useUserStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach the access token to every outgoing request.
api.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function forceLogout() {
  await tokenStorage.clear();
  try {
    useUserStore.getState().logout();
  } catch {
    // store not ready — nothing more we can do
  }
}

// On 401, try a single token refresh, then retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = typeof original?.url === "string" && original.url.includes("/auth/");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;

      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        await forceLogout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefresh } = res.data;
        await tokenStorage.setTokens(token, newRefresh);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        await forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
