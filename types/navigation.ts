/**
 * Central navigation type definitions for expo-router.
 *
 * These types are used for documentation purposes.
 * expo-router auto-generates route types from the file system.
 */

/** All routes reachable from the root Stack navigator. */
export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  auth: undefined;
  login: undefined;
  register: undefined;
  "forgot-password": undefined;
  assessment: undefined;
  "assessment-result": { score: string; goal: string };
  "assessment-review": undefined;
  "personal-details": undefined;
  notifications: undefined;
  "help-support": undefined;
  "privacy-policy": undefined;
  paywall: undefined;
  badges: undefined;
  simulations: undefined;
  "ai-tutor": undefined;
  "(tabs)": undefined;
  "(tabs)/home": { score?: string; goal?: string };
  "(tabs)/learn": undefined;
  "(tabs)/leaderboard": undefined;
  "(tabs)/news": undefined;
  "(tabs)/community": undefined;
  "(tabs)/profile": undefined;
};
