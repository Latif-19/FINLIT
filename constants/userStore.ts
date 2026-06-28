import { Platform } from "react-native";

export const userStore = {
  name: "Financial Explorer",
  email: "",
  score: 0,
  goal: "",
  avatar: "🦉", // Default avatar (Wise Saver owl)
  savings: 0,
  targetGoal: 500,
  xp: 450,
  hasDoneDailyQuiz: false,
  isPremium: false,
  lessonsCompleted: 0,
  age: '',
  phone: '',
  listeners: new Set<() => void>(),

  setName(name: string) {
    if (name && name.trim()) {
      this.name = name.trim();
      this.notify();
    }
  },

  setEmail(email: string) {
    this.email = email;
    this.notify();
  },

  setScore(score: number) {
    this.score = score;
    // Map score to custom target goal automatically
    if (score > 12) {
      this.targetGoal = 1000; // Advanced savers have higher targets
    } else if (score > 8) {
      this.targetGoal = 750;
    } else {
      this.targetGoal = 500;
    }
    this.notify();
  },

  setGoal(goal: string) {
    this.goal = goal;
    if (goal === "Build an Emergency Fund") {
      this.targetGoal = 1200;
    } else if (goal === "Start a Business") {
      this.targetGoal = 2500;
    } else if (goal === "Become Debt Free") {
      this.targetGoal = 800;
    } else if (goal === "Learn Investing") {
      this.targetGoal = 1500;
    } else if (goal === "Save for Education") {
      this.targetGoal = 1000;
    } else {
      this.targetGoal = 500;
    }
    this.notify();
  },

  setAvatar(avatar: string) {
    this.avatar = avatar;
    this.notify();
  },

  addSavings(amount: number) {
    this.savings = Math.max(0, this.savings + amount);
    this.notify();
  },

  setTargetGoal(goal: number) {
    this.targetGoal = Math.max(1, goal);
    this.notify();
  },

  addXp(amount: number) {
    this.xp = Math.max(0, this.xp + amount);
    this.notify();
  },

  incrementLessons() {
    this.lessonsCompleted += 1;
    this.notify();
  },

  setHasDoneDailyQuiz(done: boolean) {
    this.hasDoneDailyQuiz = done;
    this.notify();
  },

  setPremium(premium: boolean) {
    this.isPremium = premium;
    this.notify();
  },

  setAge(age: string) {
    this.age = age;
    this.notify();
  },

  setPhone(phone: string) {
    this.phone = phone;
    this.notify();
  },

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },

  notify() {
    this.listeners.forEach((l) => l());
  },
};
