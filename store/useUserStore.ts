import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ───────────────────────────────────────────────────────────────────

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
}

export interface UserActions {
  // Auth
  login: (name: string, email: string) => void;
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
}

// ─── Defaults ────────────────────────────────────────────────────────────────

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
  xp: 450,
  lessonsCompleted: 0,
  hasDoneDailyQuiz: false,
  isPremium: false,
};

// ─── Helper: derive target goal from score ───────────────────────────────────

function deriveTargetGoalFromScore(score: number): number {
  if (score > 12) return 1000;
  if (score > 8) return 750;
  return 500;
}

// ─── Helper: derive target goal from goal string ─────────────────────────────

function deriveTargetGoalFromGoal(goal: string): number {
  switch (goal) {
    case "Build an Emergency Fund":
      return 1200;
    case "Start a Business":
      return 2500;
    case "Become Debt Free":
      return 800;
    case "Learn Investing":
      return 1500;
    case "Save for Education":
      return 1000;
    default:
      return 500;
  }
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      // ── Auth ───────────────────────────────────────────────────────────
      login: (name, email) =>
        set({
          isAuthenticated: true,
          name: name.trim() || DEFAULT_STATE.name,
          email,
        }),

      logout: () => set({ ...DEFAULT_STATE }),

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
    }),
    {
      name: "finlit-user-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these keys (omit transient UI state if added later)
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
      }),
    }
  )
);
