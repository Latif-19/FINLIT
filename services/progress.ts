// ─── Progress Service ────────────────────────────────────────────────────────
// Backend endpoints: GET /progress, POST /progress/lesson, POST /progress/savings

import { api } from "./api";
import type { ProgressResponse, AssessmentResult } from "@/types/api";

export const progressService = {
  getProgress: () =>
    api.get<ProgressResponse>("/progress"),

  completeLesson: (lessonId: number) =>
    api.post("/progress/lesson", { lessonId }),

  logSavings: (amount: number) =>
    api.post("/progress/savings", { amount }),

  // Sends the selected option scores (one per question); the backend sums them,
  // determines the tier, saves the score/goal, and returns the learning path.
  submitAssessment: (answers: number[], goal: string) =>
    api.post<AssessmentResult>("/progress/assessment", { answers, goal }),
};
