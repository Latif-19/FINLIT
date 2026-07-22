// ─── Gamification Service (FR-6) ─────────────────────────────────────────────
// Backend endpoints: GET /gamification/leaderboard, GET /gamification/badges,
//                    POST /gamification/quiz-score

import { api } from "./api";
import type { LeaderboardResponse, UserBadge, QuizSubmitRequest, QuizSubmitResponse } from "@/types/api";

export const gamificationService = {
  getLeaderboard: () =>
    api.get<LeaderboardResponse>("/gamification/leaderboard"),

  getBadges: () =>
    api.get<UserBadge[]>("/gamification/badges"),

  submitQuizScore: (data: QuizSubmitRequest) =>
    api.post<QuizSubmitResponse>("/gamification/quiz-score", data),
};
