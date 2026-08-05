// ─── Base API Client ─────────────────────────────────────────────────────────
// All domain services import from this shared axios instance. It automatically
// attaches the JWT to every request, and on a 401 it tries to refresh the token
// once before giving up and logging the user out.

import axios from "axios";
import Constants from "expo-constants";
import { tokenStorage } from "./tokenStorage";
import { useUserStore } from "../store/useUserStore";

/**
 * Works out which backend URL to talk to — WITHOUT needing to hand-edit .env
 * every time your Wi-Fi IP changes.
 *
 * Priority:
 *   1. EXPO_PUBLIC_API_URL, if set — use this to point at a DEPLOYED backend
 *      (e.g. https://finlit.onrender.com/api). Always wins when present.
 *   2. Otherwise (local dev): reuse the LAN IP that the Expo dev server served
 *      this bundle from, and talk to the backend on that same machine at :3000.
 *      So you can scan the QR on any Wi-Fi and it just works — no .env edits.
 *   3. Fallback to localhost (iOS simulator / web).
 */
function resolveBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit && explicit.trim()) {
    return explicit.trim();
  }

  // The host Expo downloaded the JS bundle from, e.g. "10.132.37.6:8081".
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).expoGoConfig?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (typeof hostUri === "string" && hostUri.length > 0) {
    const host = hostUri.split(":")[0]; // strip Metro's :8081 port
    if (host) {
      return `http://${host}:3000/api`;
    }
  }

  return "http://localhost:3000/api";
}

const BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Generous timeout: the deployed backend (Render free tier) sleeps when idle
  // and takes 30–60s to cold start, so a short timeout would make requests
  // fail with "cannot reach the server" while the server is simply waking up.
  timeout: 90000,
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
        original.headers = original.headers || {};
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
