// ─── API Types ───────────────────────────────────────────────────────────────
// These types mirror the proposed PostgreSQL schema from the project proposal.
// Backend team should use these as the contract for all API responses.

// ── Auth (FR-1) ──────────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
}

// Strict verification: register issues no tokens — the user must confirm the
// emailed 6-digit code (POST /auth/verify-email) before logging in.
export interface RegisterResponse {
  email: string;
  message: string;
  requiresVerification: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: string;
  phone: string;
  subscriptionTier: "free" | "premium";
  createdAt: string;
}

// ── Assessment & Personalisation (FR-2) ──────────────────────────────────────

export interface AssessmentAnswer {
  questionId: number;
  answer: string;
}

export interface AssessmentSubmitRequest {
  answers: AssessmentAnswer[];
  goal: string;
}

export interface AssessmentResult {
  score: number;
  tier: "Financial Novice" | "Smart Money Manager" | "Wealth Builder Pro";
  goal: string;
  syllabus: SyllabusModule[];
}

export interface SyllabusModule {
  moduleId: number;
  title: string;
  order: number;
}

// ── Content / Lessons (FR-3) ────────────────────────────────────────────────

export interface LessonModule {
  id: number;
  title: string;
  desc: string;
  duration: string;
  xp: string;
  xpVal: number;
  content: string[];
  emoji?: string;
}

export interface LessonListResponse {
  modules: LessonModule[];
}

// ── Quizzes (FR-4) ──────────────────────────────────────────────────────────

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface QuizSubmitRequest {
  moduleId: number;
  answers: { questionIndex: number; selectedOptionIndex: number }[];
}

export interface QuizSubmitResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number[];
}

// ── Simulations (FR-5) ──────────────────────────────────────────────────────

export interface SimulationSaveRequest {
  type: string;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}

export interface SimulationSaveResponse {
  id: string;
  savedAt: string;
}

// A full saved simulation as returned by GET /simulations/history.
export interface SimulationRecord {
  id: string;
  type: string;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
  savedAt: string;
}

// ── Gamification (FR-6) ─────────────────────────────────────────────────────

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface UserBadge extends BadgeDefinition {
  unlockedAt: string | null;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUserRank: number;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

// ── Progress Tracking ────────────────────────────────────────────────────────

export interface ProgressResponse {
  lessonsCompleted: number;
  totalLessons: number;
  xp: number;
  streak: number;
  score: number;
  goal: string;
  badges: UserBadge[];
  quizScores: Record<number, number[]>;
  savings: number;
  targetGoal: number;
}

// ── News (FR-6 proposed) ────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  content: string[];
}

// ── Community Forum ──────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  body: string;
  category: string;
  likes: number;
  likedByCurrentUser: boolean;
  replies: CommunityReply[];
  createdAt: string;
}

export interface CommunityReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  body: string;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  category: string;
}

export interface CreateReplyRequest {
  body: string;
}

// ── AI Tutor ─────────────────────────────────────────────────────────────────

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TutorChatRequest {
  message: string;
  history: TutorMessage[];
}

export interface TutorChatResponse {
  reply: string;
}

// ── Notifications (FR-8) ────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: "badge_earned" | "streak_reminder" | "lesson_reminder" | "leaderboard_milestone";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
