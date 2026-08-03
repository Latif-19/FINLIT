// ─── Profile Service ─────────────────────────────────────────────────────────
// Backend endpoints: GET /profile, PUT /profile, POST /profile/premium

import { api } from "./api";
import type { UserProfile } from "@/types/api";

export const profileService = {
  getProfile: () => api.get<UserProfile>("/profile"),

  updateProfile: (data: { name: string; avatar?: string; age?: string; phone?: string; goal?: string }) =>
    api.put<UserProfile>("/profile", data),

  // Backend re-verifies this Paystack reference directly with Paystack before
  // granting premium — it isn't just trusting the client's word.
  activatePremium: (reference: string) =>
    api.post<UserProfile>("/profile/premium", { reference }),
};
