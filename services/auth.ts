// ─── Auth Service (FR-1) ─────────────────────────────────────────────────────
// Backend endpoints: POST /auth/register, /auth/verify-email, /auth/resend-code,
//                    POST /auth/login, POST /auth/forgot-password

import { api } from "./api";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from "@/types/api";

export const authService = {
  // Strict verification: register returns no tokens, only a "check your email"
  // response. Tokens are issued by verifyEmail once the code is confirmed.
  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>("/auth/register", data),

  verifyEmail: (data: VerifyEmailRequest) =>
    api.post<AuthResponse>("/auth/verify-email", data),

  resendCode: (email: string) =>
    api.post<{ message: string }>("/auth/resend-code", { email }),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),

  verifyResetCode: (data: VerifyResetCodeRequest) =>
    api.post<{ message: string }>("/auth/verify-reset-code", data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<{ message: string }>("/auth/reset-password", data),
};
