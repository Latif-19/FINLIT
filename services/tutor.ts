// ─── AI Tutor Service ────────────────────────────────────────────────────────
// Backend endpoints: POST /tutor/chat
// Note: The Gemini API call should be server-side only (API key stays on backend).

import { api } from "./api";
import type { TutorChatRequest, TutorChatResponse } from "@/types/api";

export const tutorService = {
  chat: (data: TutorChatRequest) =>
    api.post<TutorChatResponse>("/tutor/chat", data),
};
