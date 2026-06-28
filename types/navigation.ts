/**
 * Central navigation type definitions for expo-router.
 *
 * Importing this file and using the typed helpers removes every
 * `as any` cast on router.push / router.replace calls.
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
  simulations: undefined;
  "ai-tutor": undefined;
  "(tabs)": undefined;
  "(tabs)/home": { score?: string; goal?: string };
  "(tabs)/learn": undefined;
  "(tabs)/news": undefined;
  "(tabs)/community": undefined;
  "(tabs)/profile": undefined;
};

// Extend expo-router's type system so that `router.push()` / `router.replace()`
// accept only the routes defined above.
declare module "expo-router" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RouteParamList extends RootStackParamList {}
}
