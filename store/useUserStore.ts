import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenStorage } from "../services/tokenStorage";

// The authenticated user profile returned by the backend (subset used here).
export interface AuthUserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  age?: string;
  phone?: string;
  subscriptionTier?: string;
  createdAt?: string;
}

// The progress dashboard payload returned by GET /progress.
export interface BackendProgress {
  lessonsCompleted: number;
  totalLessons?: number;
  xp: number;
  streak: number;
  score: number;
  goal: string;
  savings: number;
  targetGoal: number;
  quizScores: Record<number, number[]>;
  badges: { id: string; name: string; description: string; emoji: string; unlockedAt: string | null }[];
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: number | null; // timestamp or null if locked
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
}

export interface SimulationResult {
  id: string;
  type: string;
  label: string;
  params: Record<string, string>;
  result: string;
  savedAt: string;
}

export interface UserState {
  // Auth
  isAuthenticated: boolean;
  name: string;
  email: string;

  // Profile
  avatar: string;
  age: string;
  phone: string;

  // Financial
  score: number;
  goal: string;
  savings: number;
  targetGoal: number;
  xp: number;
  lessonsCompleted: number;
  hasDoneDailyQuiz: boolean;
  isPremium: boolean;

  // Gamification (FR-6)
  streak: number;
  lastActiveDate: string | null; // ISO date string
  badges: Badge[];
  quizScores: Record<number, number[]>; // moduleId -> array of scores

  // Dates
  createdAt: string | null; // ISO date string
  lastAssessedAt: string | null; // ISO date string

  // Simulation History (FR-5: results saved to profile)
  simulationHistory: SimulationResult[];

  // Theming & Accessibility
  themeMode: 'system' | 'light' | 'dark';

  // Notification Preferences
  notificationPrefs: Record<string, boolean>;
}

export interface UserActions {
  // Auth
  login: (name: string, email: string) => void;
  setAuthenticatedUser: (user: AuthUserProfile) => void;
  applyProgress: (progress: BackendProgress) => void;
  applyBadges: (badges: { id: string; name: string; description: string; emoji: string; unlockedAt: string | null }[]) => void;
  logout: () => void;

  // Profile
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAvatar: (avatar: string) => void;
  setAge: (age: string) => void;
  setPhone: (phone: string) => void;

  // Financial
  setScore: (score: number) => void;
  setGoal: (goal: string) => void;
  addSavings: (amount: number) => void;
  setTargetGoal: (goal: number) => void;
  addXp: (amount: number) => void;
  incrementLessons: () => void;
  setHasDoneDailyQuiz: (done: boolean) => void;
  setPremium: (premium: boolean) => void;

  // Gamification (FR-6)
  updateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  saveQuizScore: (moduleId: number, score: number) => void;

  // Theming & Accessibility
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;

  // Notification Preferences
  setNotificationPref: (key: string, value: boolean) => void;

  // Simulation History
  saveSimulationResult: (result: Omit<SimulationResult, 'id' | 'savedAt'>) => void;
  setSimulationHistory: (history: SimulationResult[]) => void;
  clearSimulationHistory: () => void;

  // Dates
  setLastAssessedAt: (date: string) => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_BADGES: Badge[] = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", emoji: "🎯", unlockedAt: null },
  { id: "three-lessons", name: "Getting Smart", description: "Complete 3 lessons", emoji: "📚", unlockedAt: null },
  { id: "all-lessons", name: "Financial Guru", description: "Complete all 6 lessons", emoji: "🏆", unlockedAt: null },
  { id: "quiz-perfect", name: "Perfect Score", description: "Get 100% on any quiz", emoji: "💯", unlockedAt: null },
  { id: "streak-3", name: "On Fire", description: "Maintain a 3-day streak", emoji: "🔥", unlockedAt: null },
  { id: "streak-7", name: "Unstoppable", description: "Maintain a 7-day streak", emoji: "⚡", unlockedAt: null },
  { id: "first-savings", name: "Saver", description: "Log your first savings", emoji: "💰", unlockedAt: null },
  { id: "savings-goal", name: "Goal Crusher", description: "Reach your savings goal", emoji: "🎯", unlockedAt: null },
  { id: "simulator-user", name: "Explorer", description: "Use a financial simulator", emoji: "🧮", unlockedAt: null },
  { id: "ai-tutor", name: "Curious Mind", description: "Ask the AI Tutor a question", emoji: "🤖", unlockedAt: null },
];

const DEFAULT_STATE: UserState = {
  isAuthenticated: false,
  name: "Financial Explorer",
  email: "",
  avatar: "🦉",
  age: "",
  phone: "",
  score: 0,
  goal: "",
  savings: 0,
  targetGoal: 500,
  xp: 0,
  lessonsCompleted: 0,
  hasDoneDailyQuiz: false,
  isPremium: false,
  streak: 0,
  lastActiveDate: null,
  // Start new users at 0 XP; the backend progress dashboard is the source of
  // truth and syncs the real value on first load.
  badges: DEFAULT_BADGES,
  quizScores: {},
  themeMode: 'system',
  notificationPrefs: {
    dailyReminders: true,
    streakAlerts: true,
    quizReminders: true,
    badgeAlerts: true,
    leaderboardUpdates: false,
    newsUpdates: false,
    communityReplies: false,
  },
  createdAt: null,
  lastAssessedAt: null,
  simulationHistory: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveTargetGoalFromScore(score: number): number {
  if (score > 12) return 1000;
  if (score > 8) return 750;
  return 500;
}

function deriveTargetGoalFromGoal(goal: string): number {
  switch (goal) {
    case "Build an Emergency Fund": return 1200;
    case "Start a Business": return 2500;
    case "Become Debt Free": return 800;
    case "Learn Investing": return 1500;
    case "Save for Education": return 1000;
    default: return 500;
  }
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // ── Auth ───────────────────────────────────────────────────────────
      login: (name, email) =>
        set((state) => ({
          isAuthenticated: true,
          name: name.trim() || state.name,
          email,
          createdAt: state.createdAt || new Date().toISOString(),
        })),

      // Applies the backend's user profile to the store after login/register.
      setAuthenticatedUser: (user) =>
        set((state) => {
          // On a shared device the store is persisted to disk, so if a DIFFERENT
          // account signs in we must wipe the previous user's progress first —
          // otherwise account B inherits account A's XP/savings/badges/streak.
          // The backend re-syncs the real values immediately after (applyProgress).
          const isDifferentAccount =
            !!state.email && !!user.email && state.email !== user.email;
          const progressReset = isDifferentAccount
            ? {
                score: 0,
                goal: "",
                savings: 0,
                targetGoal: 500,
                xp: 0,
                lessonsCompleted: 0,
                hasDoneDailyQuiz: false,
                streak: 0,
                lastActiveDate: null,
                badges: DEFAULT_BADGES,
                quizScores: {},
                simulationHistory: [],
                lastAssessedAt: null,
              }
            : {};
          return {
            ...progressReset,
            isAuthenticated: true,
            name: user.name?.trim() || state.name,
            email: user.email || state.email,
            avatar: user.avatar || state.avatar,
            age: user.age ?? state.age,
            phone: user.phone ?? state.phone,
            isPremium: user.subscriptionTier === "premium",
            createdAt:
              user.createdAt ||
              (isDifferentAccount ? new Date().toISOString() : state.createdAt) ||
              new Date().toISOString(),
          };
        }),

      // Syncs the backend progress dashboard into the store (source of truth).
      applyProgress: (progress) =>
        set((state) => ({
          xp: progress.xp,
          streak: progress.streak,
          lessonsCompleted: progress.lessonsCompleted,
          savings: progress.savings,
          // Backend is the source of truth when it has a value; otherwise keep
          // whatever the client already has (e.g. an offline assessment).
          score: progress.score > 0 ? progress.score : state.score,
          goal: progress.goal ? progress.goal : state.goal,
          // The backend doesn't set a target yet; keep the client-derived one
          // unless the backend has a real value.
          targetGoal: progress.targetGoal > 0 ? progress.targetGoal : state.targetGoal,
          quizScores:
            progress.quizScores && Object.keys(progress.quizScores).length > 0
              ? progress.quizScores
              : state.quizScores,
          badges:
            progress.badges && progress.badges.length > 0
              ? progress.badges.map((b) => ({
                  id: b.id,
                  name: b.name,
                  description: b.description,
                  emoji: b.emoji,
                  unlockedAt: b.unlockedAt ? Date.parse(b.unlockedAt) : null,
                }))
              : state.badges,
        })),

      // Syncs just the badge list from the backend (used by the Badges screen).
      applyBadges: (badges) =>
        set((state) => ({
          badges:
            badges && badges.length > 0
              ? badges.map((b) => ({
                  id: b.id,
                  name: b.name,
                  description: b.description,
                  emoji: b.emoji,
                  unlockedAt: b.unlockedAt ? Date.parse(b.unlockedAt) : null,
                }))
              : state.badges,
        })),

      logout: () => {
        // Clear the stored JWTs, then reset state (keeping the display name).
        tokenStorage.clear();
        set((state) => ({ ...DEFAULT_STATE, name: state.name }));
      },

      // ── Profile ────────────────────────────────────────────────────────
      setName: (name) => {
        if (name && name.trim()) {
          set({ name: name.trim() });
        }
      },

      setEmail: (email) => set({ email }),
      setAvatar: (avatar) => set({ avatar }),
      setAge: (age) => set({ age }),
      setPhone: (phone) => set({ phone }),

      // ── Financial ──────────────────────────────────────────────────────
      setScore: (score) =>
        set({
          score,
          targetGoal: deriveTargetGoalFromScore(score),
        }),

      setGoal: (goal) =>
        set({
          goal,
          targetGoal: deriveTargetGoalFromGoal(goal),
        }),

      addSavings: (amount) =>
        set((state) => ({
          savings: Math.max(0, state.savings + amount),
        })),

      setTargetGoal: (goal) =>
        set({ targetGoal: Math.max(1, goal) }),

      addXp: (amount) =>
        set((state) => ({
          xp: Math.max(0, state.xp + amount),
        })),

      incrementLessons: () =>
        set((state) => ({
          lessonsCompleted: state.lessonsCompleted + 1,
        })),

      setHasDoneDailyQuiz: (done) => set({ hasDoneDailyQuiz: done }),
      setPremium: (premium) => set({ isPremium: premium }),

      // ── Gamification (FR-6) ────────────────────────────────────────────
      updateStreak: () => {
        const today = getTodayISO();
        const yesterday = getYesterdayISO();
        const { lastActiveDate, streak, badges } = get();

        let newStreak = streak;
        if (lastActiveDate === today) {
          return; // already active today
        } else if (lastActiveDate === yesterday) {
          newStreak = streak + 1;
        } else {
          newStreak = 1;
        }

        const updatedBadges = badges.map((b) => {
          if (b.unlockedAt) return b;
          if (b.id === "streak-3" && newStreak >= 3) return { ...b, unlockedAt: Date.now() };
          if (b.id === "streak-7" && newStreak >= 7) return { ...b, unlockedAt: Date.now() };
          return b;
        });

        set({ streak: newStreak, lastActiveDate: today, badges: updatedBadges });
      },

      unlockBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.unlockedAt ? { ...b, unlockedAt: Date.now() } : b
          ),
        })),

      saveQuizScore: (moduleId, score) =>
        set((state) => ({
          quizScores: {
            ...state.quizScores,
            [moduleId]: [...(state.quizScores[moduleId] || []), score],
          },
        })),

      // ── Simulation History ────────────────────────────────────────────────
      saveSimulationResult: (result) =>
        set((state) => ({
          simulationHistory: [
            {
              ...result,
              id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              savedAt: new Date().toISOString(),
            },
            ...state.simulationHistory,
          ].slice(0, 5), // Keep last 5
        })),

      setSimulationHistory: (history) => set({ simulationHistory: history.slice(0, 5) }),

      clearSimulationHistory: () => set({ simulationHistory: [] }),

      // ── Theming & Accessibility ─────────────────────────────────────────
      setThemeMode: (mode) => set({ themeMode: mode }),

      // ── Notification Preferences ─────────────────────────────────────────
      setNotificationPref: (key, value) =>
        set((state) => ({
          notificationPrefs: { ...state.notificationPrefs, [key]: value },
        })),

      // ── Dates ────────────────────────────────────────────────────────────
      setLastAssessedAt: (date) => set({ lastAssessedAt: date }),
    }),
    {
      name: "finlit-user-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        name: state.name,
        email: state.email,
        avatar: state.avatar,
        age: state.age,
        phone: state.phone,
        score: state.score,
        goal: state.goal,
        savings: state.savings,
        targetGoal: state.targetGoal,
        xp: state.xp,
        lessonsCompleted: state.lessonsCompleted,
        hasDoneDailyQuiz: state.hasDoneDailyQuiz,
        isPremium: state.isPremium,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        badges: state.badges,
        quizScores: state.quizScores,
        themeMode: state.themeMode,
        notificationPrefs: state.notificationPrefs,
        createdAt: state.createdAt,
        lastAssessedAt: state.lastAssessedAt,
        simulationHistory: state.simulationHistory,
      }),
    }
  )
);
