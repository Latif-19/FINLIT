// ─── Content Service (FR-3) ──────────────────────────────────────────────────
// Backend endpoints: GET /lessons, GET /lessons/:id, GET /news

import { api } from "./api";
import type { LessonModule, LessonListResponse, NewsArticle } from "@/types/api";

export const contentService = {
  getModules: () =>
    api.get<LessonListResponse>("/lessons"),

  getModule: (id: number) =>
    api.get<LessonModule>(`/lessons/${id}`),

  getNews: () =>
    api.get<NewsArticle[]>("/news"),

  getNewsArticle: (id: string) =>
    api.get<NewsArticle>(`/news/${id}`),
};
