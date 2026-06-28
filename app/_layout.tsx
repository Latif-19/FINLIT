import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import "../global.css";
import "@/types/navigation";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments() as unknown as string[];
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  // Monitor store hydration
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsub;
  }, []);

  // Navigation Guard logic
  useEffect(() => {
    if (!isHydrated) return;

    // Detect if we are on a public auth screen
    const inAuthGroup =
      segments[0] === "auth" ||
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "forgot-password" ||
      segments[0] === "onboarding" ||
      segments[0] === "index" ||
      segments.length === 0;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user
      router.replace("/auth");
    } else if (isAuthenticated && inAuthGroup && segments[0] !== "index") {
      // Prevent authenticated user from accessing auth screens
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, segments, isHydrated]);

  return (
    <>
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
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="assessment" />
        <Stack.Screen name="assessment-result" />
        <Stack.Screen name="personal-details" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="assessment-review" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
