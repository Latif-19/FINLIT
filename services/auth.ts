// ─── Auth Service (FR-1) ─────────────────────────────────────────────────────
// Backend endpoints: POST /auth/register, POST /auth/login, POST /auth/forgot-password

import { api } from "./api";
import type { RegisterRequest, LoginRequest, AuthResponse } from "@/types/api";

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  // Placeholder: Google Sign-In token exchange
  googleSignIn: (idToken: string) =>
    api.post<AuthResponse>("/auth/google", { idToken }),
};
