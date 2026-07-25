// ─── Notification Service (FR-8) ────────────────────────────────────────────
// Backend endpoints: GET /notifications, POST /notifications/:id/read

import { api } from "./api";
import type { AppNotification } from "@/types/api";

export const notificationService = {
  getNotifications: () =>
    api.get<AppNotification[]>("/notifications"),

  markAsRead: (id: string) =>
    api.post(`/notifications/${id}/read`),
};
