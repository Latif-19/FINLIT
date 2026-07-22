// Mock notifications data — will be replaced by GET /api/notifications
import { AppNotification } from "@/types/api";

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "lesson_reminder",
    title: "Continue Learning!",
    body: "You haven't completed Module 3 yet. Keep going!",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n2",
    type: "streak_reminder",
    title: "Don't break your streak!",
    body: "Log in today to maintain your learning streak.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n3",
    type: "badge_earned",
    title: "Badge Unlocked!",
    body: "You earned the 'First Steps' badge for completing your first lesson.",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
