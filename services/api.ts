import axios from "axios";

// Pull base URL from environment variables with a fallback to local server (useful for development)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Simple interceptor placeholders for request/response logs or auth handling
api.interceptors.request.use(
  (config) => {
    // Ready for adding auth token dynamic headers when backend is hooked up
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global API error handler placeholder
    console.error("API Error Response:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
