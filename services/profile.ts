// ─── Profile Service ─────────────────────────────────────────────────────────
// Backend endpoints: GET /profile, PUT /profile, POST /profile/premium

import { api } from "./api";
import type { UserProfile } from "@/types/api";

export const profileService = {
  getProfile: () => api.get<UserProfile>("/profile"),

  updateProfile: (data: { name: string; avatar?: string; age?: string; phone?: string }) =>
    api.put<UserProfile>("/profile", data),

  // Marks the user premium on the backend after a confirmed payment.
  activatePremium: () => api.post<UserProfile>("/profile/premium"),
};
