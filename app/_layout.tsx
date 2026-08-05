import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Appearance, View, Image } from "react-native";
import { vars } from "nativewind";
import { useUserStore } from "../store/useUserStore";
import { getThemeVars } from "../constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import "../global.css";
import "@/types/navigation";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold
} from "@expo-google-fonts/poppins";
import { PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans";
import * as SplashScreen from "expo-splash-screen";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { PaystackProvider } from "react-native-paystack-webview";

const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_KEY || "";

// Configure Reanimated logger to suppress strict-mode warnings during component render
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync().catch(() => {});

function NavigationGuard() {
  const router = useRouter();
  const segments = useSegments() as unknown as string[];
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const lastAssessedAt = useUserStore((s) => s.lastAssessedAt);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Only perform redirect when the navigation container is fully mounted and ready
    if (!rootNavigationState?.key) return;

    // Detect if we are on a public auth screen
    const inAuthGroup =
      segments[0] === "auth" ||
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "verify-email" ||
      segments[0] === "forgot-password" ||
      segments[0] === "onboarding" ||
      segments[0] === "index" ||
      segments.length === 0;

    // The one-time onboarding assessment — backend-verified via lastAssessedAt,
    // not a one-shot redirect that's easy to fall out of (e.g. by later logging
    // in instead of registering fresh).
    const inAssessmentFlow =
      segments[0] === "assessment" || segments[0] === "assessment-result";
    const needsAssessment = isAuthenticated && !lastAssessedAt;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user
      router.replace("/auth");
    } else if (isAuthenticated && inAuthGroup && segments[0] !== "index") {
      // Prevent authenticated user from accessing auth screens
      router.replace(needsAssessment ? "/assessment" : "/(tabs)/home");
    } else if (needsAssessment && !inAuthGroup && !inAssessmentFlow) {
      // Never let an authenticated-but-unassessed user reach the rest of the
      // app, regardless of how they got authenticated.
      router.replace("/assessment");
    }
  }, [isAuthenticated, lastAssessedAt, segments, router, rootNavigationState?.key]);

  return null;
}

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Monitor store hydration and font loading
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsub;
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isHydrated]);
  // Resolve active theme variables style object
  const themePreference = useUserStore((s) => s.themePreference);
  const { isDark: isDarkMode } = useThemeColors();
  const activeThemeVars = getThemeVars("none", "emerald", isDarkMode);

  // Keep the native scheme in sync with the user's choice. In "system" mode
  // pass null to UNPIN any previously forced scheme so the OS drives changes
  // live again (without this, an earlier dark/light pin keeps the app stuck).
  useEffect(() => {
    if (typeof Appearance.setColorScheme === "function") {
      if (themePreference === "system") {
        Appearance.setColorScheme(null);
      } else {
        Appearance.setColorScheme(isDarkMode ? "dark" : "light");
      }
    }
  }, [isDarkMode, themePreference]);

  if (!isHydrated || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY} currency="GHS" defaultChannels={["card", "mobile_money", "bank_transfer"]}>
    <View style={vars(activeThemeVars)} className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="assessment" />
        <Stack.Screen name="assessment-result" />
        <Stack.Screen name="personal-details" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="assessment-review" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="certificate" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <NavigationGuard />
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
    </PaystackProvider>
  );
}
